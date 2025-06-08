import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AlbumService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllAlbums() {
    return this.prisma.album.findMany({
      include: {
        artist: true,
        tracks: true,
      },
    });
  }

  async getAlbumById(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
      include: {
        artist: true,
        tracks: true,
      },
    });

    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    return album;
  }

  async createAlbum({ name, artistId, year }: CreateAlbumDto) {
    return this.prisma.album.create({
      data: {
        name,
        artistId: artistId ?? null,
        year,
      },
    });
  }

  async updateAlbum(id: string, { name, artistId, year }: UpdateAlbumDto) {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.album.update({
      where: { id },
      data: { name, artistId, year },
    });
  }

  async deleteAlbum(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.album.delete({ where: { id } });
  }

  async updateArtistId(artistId: string) {
    return this.prisma.album.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }
}
