import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from '../prisma.service';
import { LoggingService } from 'src/logging.service';

@Injectable()
export class TrackService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly loggingService: LoggingService,
  ) {}

  async getAllTracks() {
    this.loggingService.logRequest('GET', '/track', {}, {});
    const tracks = await this.prisma.track.findMany();
    this.loggingService.logResponse(HttpStatus.OK, tracks);
    return tracks;
  }

  async getTrackById(id: string) {
    this.loggingService.logRequest('GET', `/track/${id}`, {}, {});
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      this.loggingService.logError(new Error('Track is not found'));
      throw new HttpException('Track is not found', HttpStatus.NOT_FOUND);
    }
    this.loggingService.logResponse(HttpStatus.OK, track);
    return track;
  }

  async createTrack({ name, artistId, albumId, duration }: CreateTrackDto) {
    this.loggingService.logRequest('POST', '/track', {}, {});

    const track = await this.prisma.track.create({
      data: {
        name,
        artistId: artistId ?? null,
        albumId: albumId ?? null,
        duration,
      },
    });
    this.loggingService.logResponse(HttpStatus.CREATED, track);
    return track;
  }

  async updateTrack(
    id: string,
    { name, artistId, albumId, duration }: UpdateTrackDto,
  ) {
    this.loggingService.logRequest('PUT', `/track/${id}`, {}, {});
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      this.loggingService.logError(new Error('Track is not found'));
      throw new HttpException('Track is not found', HttpStatus.NOT_FOUND);
    }

    const updatedTrack = await this.prisma.track.update({
      where: { id },
      data: {
        name,
        artistId,
        albumId,
        duration,
      },
    });
    this.loggingService.logResponse(HttpStatus.OK, updatedTrack);
    return updatedTrack;
  }

  async deleteTrack(id: string) {
    this.loggingService.logRequest('DELETE', `/track/${id}`, {}, {});
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      this.loggingService.logError(new Error('Track is not found'));
      throw new HttpException('Track is not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.track.delete({ where: { id } });
    this.loggingService.logResponse(HttpStatus.OK, {
      message: `Track with ${id} deleted`,
    });
  }

  async updateArtistId(artistId: string) {
    await this.prisma.track.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }

  async updateAlbumId(albumId: string) {
    await this.prisma.track.updateMany({
      where: { albumId },
      data: { albumId: null },
    });
  }
}
