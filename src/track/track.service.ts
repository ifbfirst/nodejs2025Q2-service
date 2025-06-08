import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TrackService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTracks() {
    return await this.prisma.track.findMany();
  }

  async getTrackById(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new HttpException('Track is not found', HttpStatus.NOT_FOUND);
    }
    return track;
  }

  async createTrack({ name, artistId, albumId, duration }: CreateTrackDto) {
    return await this.prisma.track.create({
      data: {
        name,
        artistId: artistId ?? null,
        albumId: albumId ?? null,
        duration,
      },
    });
  }

  async updateTrack(
    id: string,
    { name, artistId, albumId, duration }: UpdateTrackDto,
  ) {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new HttpException('Track is not found', HttpStatus.NOT_FOUND);
    }

    return await this.prisma.track.update({
      where: { id },
      data: {
        name,
        artistId,
        albumId,
        duration,
      },
    });
  }

  async deleteTrack(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new HttpException('Track is not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.track.delete({ where: { id } });
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
