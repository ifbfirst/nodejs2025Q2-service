import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FavsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllFavs() {
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

    return { artists, albums, tracks };
  }

  async createFavTrack(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        isFavorite: true,
      },
    });

    if (!track) {
      throw new HttpException(
        'Track does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.prisma.track.update({
      where: { id },
      data: { isFavorite: true },
    });
  }

  async deleteFavTrack(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        isFavorite: true,
      },
    });

    if (!track || !track.isFavorite) {
      throw new HttpException(
        'Track not found in favorites',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.track.update({
      where: { id },
      data: { isFavorite: false },
    });
  }

  async createFavArtist(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        isFavorite: true,
      },
    });

    if (!artist) {
      throw new HttpException(
        'Artist does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.prisma.artist.update({
      where: { id },
      data: { isFavorite: true },
    });
  }

  async deleteFavArtist(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        isFavorite: true,
      },
    });

    if (!artist || !artist.isFavorite) {
      throw new HttpException(
        'Artist not found in favorites',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.artist.update({
      where: { id },
      data: { isFavorite: false },
    });
  }

  async createFavAlbum(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        isFavorite: true,
      },
    });

    if (!album) {
      throw new HttpException(
        'Album does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.prisma.album.update({
      where: { id },
      data: { isFavorite: true },
    });
  }

  async deleteFavAlbum(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        isFavorite: true,
      },
    });

    if (!album || !album.isFavorite) {
      throw new HttpException(
        'Album not found in favorites',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.album.update({
      where: { id },
      data: { isFavorite: false },
    });
  }
}
