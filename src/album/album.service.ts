import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaService } from '../prisma.service';
import { LoggingService } from 'src/logging.service';

@Injectable()
export class AlbumService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly loggingService: LoggingService,
  ) {}

  async getAllAlbums() {
    this.loggingService.logRequest('GET', '/albums', {}, {});

    const albums = await this.prisma.album.findMany({
      include: {
        artist: true,
        tracks: true,
      },
    });
    this.loggingService.logResponse(HttpStatus.OK, albums);
    return albums;
  }

  async getAlbumById(id: string) {
    this.loggingService.logRequest('GET', `/albums/${id}`, {}, {});
    const album = await this.prisma.album.findUnique({
      where: { id },
      include: {
        artist: true,
        tracks: true,
      },
    });

    if (!album) {
      this.loggingService.logError(
        new Error(`Album with id ${id} is not found`),
      );
      throw new HttpException('Album is not found', HttpStatus.NOT_FOUND);
    }
    this.loggingService.logResponse(HttpStatus.OK, album);
    return album;
  }

  async createAlbum({ name, artistId, year }: CreateAlbumDto) {
    this.loggingService.logRequest('POST', '/album', {}, {});
    const album = await this.prisma.album.create({
      data: {
        name,
        artistId: artistId ?? null,
        year,
      },
    });
    this.loggingService.logResponse(HttpStatus.CREATED, album);
    return album;
  }

  async updateAlbum(id: string, { name, artistId, year }: UpdateAlbumDto) {
    this.loggingService.logRequest('PUT', `album/${id}`, {}, {});
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) {
      this.loggingService.logError(new Error('Album is not found'));
      throw new HttpException('Album is not found', HttpStatus.NOT_FOUND);
    }

    const updatedAlbum = await this.prisma.album.update({
      where: { id },
      data: { name, artistId, year },
    });
    this.loggingService.logResponse(
      HttpStatus.OK,
      `Album with id ${id} updated`,
    );
    return updatedAlbum;
  }

  async deleteAlbum(id: string) {
    this.loggingService.logRequest('DELETE', `/album/${id}`, {}, {});
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) {
      this.loggingService.logError(new Error('Album is not found'));
      throw new HttpException('Album is not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.album.delete({ where: { id } });
    this.loggingService.logResponse(HttpStatus.OK, {
      message: `Album with ${id} deleted`,
    });
  }

  async updateArtistId(artistId: string) {
    return this.prisma.album.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }
}
