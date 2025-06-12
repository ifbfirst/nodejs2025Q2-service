import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LoggingService } from 'src/logging.service';

@Injectable()
export class FavsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly loggingService: LoggingService,
  ) {}

  async getAllFavs() {
    this.loggingService.logRequest('GET', '/favs', {}, {});
    const artists = await this.prisma.artist.findMany({
      where: { isFavorite: true },
      select: { id: true, name: true, grammy: true },
    });

    const albums = await this.prisma.album.findMany({
      where: { isFavorite: true },
      select: { id: true, name: true, year: true, artistId: true },
    });

    const tracks = await this.prisma.track.findMany({
      where: { isFavorite: true },
      select: {
        id: true,
        name: true,
        duration: true,
        artistId: true,
        albumId: true,
      },
    });
    const favs = { artists, albums, tracks };
    this.loggingService.logResponse(HttpStatus.OK, favs);
    return favs;
  }

  async createFavTrack(id: string) {
    this.loggingService.logRequest('POST', `/favs/track/${id}`, {}, {});
    const track = await this.prisma.track.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        isFavorite: true,
      },
    });

    if (!track) {
      this.loggingService.logError(new Error('Track is not found'));
      throw new HttpException(
        'Track does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.prisma.track.update({
      where: { id },
      data: { isFavorite: true },
    });
    this.loggingService.logResponse(HttpStatus.CREATED, {
      message: `Track with ${id} added to favorites`,
    });
  }

  async deleteFavTrack(id: string) {
    this.loggingService.logRequest('DELETE', `/favs/track/${id}`, {}, {});
    const track = await this.prisma.track.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        isFavorite: true,
      },
    });

    if (!track || !track.isFavorite) {
      this.loggingService.logError(new Error('Track is not found'));
      throw new HttpException(
        'Track not found in favorites',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.track.update({
      where: { id },
      data: { isFavorite: false },
    });
    this.loggingService.logResponse(HttpStatus.OK, {
      message: `Track with ${id} removed from favorites`,
    });
  }

  async createFavArtist(id: string) {
    this.loggingService.logRequest('POST', `/favs/artist/${id}`, {}, {});
    const artist = await this.prisma.artist.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        isFavorite: true,
      },
    });

    if (!artist) {
      this.loggingService.logError(new Error('Artist is not found'));
      throw new HttpException(
        'Artist does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.prisma.artist.update({
      where: { id },
      data: { isFavorite: true },
    });
    this.loggingService.logResponse(HttpStatus.CREATED, {
      message: `Artist with ${id} added to favorites`,
    });
  }

  async deleteFavArtist(id: string) {
    this.loggingService.logRequest('DELETE', `/favs/artist/${id}`, {}, {});
    const artist = await this.prisma.artist.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        isFavorite: true,
      },
    });

    if (!artist || !artist.isFavorite) {
      this.loggingService.logError(new Error('Artist is not found'));
      throw new HttpException(
        'Artist not found in favorites',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.artist.update({
      where: { id },
      data: { isFavorite: false },
    });
    this.loggingService.logResponse(HttpStatus.OK, {
      message: `Artist with ${id} removed from favorites`,
    });
  }

  async createFavAlbum(id: string) {
    this.loggingService.logRequest('POST', `/favs/album/${id}`, {}, {});
    const album = await this.prisma.album.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        isFavorite: true,
      },
    });

    if (!album) {
      this.loggingService.logError(new Error('Album is not found'));
      throw new HttpException(
        'Album does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.prisma.album.update({
      where: { id },
      data: { isFavorite: true },
    });
    this.loggingService.logResponse(HttpStatus.CREATED, {
      message: `Album with ${id} added to favorites`,
    });
  }

  async deleteFavAlbum(id: string) {
    this.loggingService.logRequest('DELETE', `/favs/album/${id}`, {}, {});
    const album = await this.prisma.album.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        isFavorite: true,
      },
    });

    if (!album || !album.isFavorite) {
      this.loggingService.logError(new Error('Album is not found'));
      throw new HttpException(
        'Album not found in favorites',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.album.update({
      where: { id },
      data: { isFavorite: false },
    });

    this.loggingService.logResponse(HttpStatus.OK, {
      message: `Album with ${id} removed from favorites`,
    });
  }
}
