import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from '../prisma.service';
import { LoggingService } from 'src/logging.service';

@Injectable()
export class ArtistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly loggingService: LoggingService,
  ) {}

  async getAllArtists() {
    this.loggingService.logRequest('GET', '/artist', {}, {});
    const artists = await this.prisma.artist.findMany();
    this.loggingService.logResponse(HttpStatus.OK, artists);
    return artists;
  }

  async getArtistById(id: string) {
    this.loggingService.logRequest('GET', `/artist/${id}`, {}, {});
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      this.loggingService.logError(new Error('Artist is not found'));
      throw new HttpException('Artist is not found', HttpStatus.NOT_FOUND);
    }
    this.loggingService.logResponse(HttpStatus.OK, artist);
    return artist;
  }

  async createArtist({ name, grammy }: CreateArtistDto) {
    this.loggingService.logRequest('POST', `/artist`, {}, {});
    const artist = await this.prisma.artist.create({
      data: {
        name,
        grammy,
      },
    });
    this.loggingService.logResponse(HttpStatus.CREATED, artist);
    return artist;
  }

  async updateArtist(id: string, { name, grammy }: UpdateArtistDto) {
    this.loggingService.logRequest('PUT', `/artist/${id}`, {}, {});

    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      this.loggingService.logError(new Error('Artist is not found'));
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    const updatedArtist = this.prisma.artist.update({
      where: { id },
      data: { name, grammy },
    });

    this.loggingService.logResponse(HttpStatus.OK, updatedArtist);
    return updatedArtist;
  }

  async deleteArtist(id: string) {
    this.loggingService.logRequest('DELETE', `/artist/${id}`, {}, {});
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      this.loggingService.logError(new Error('Artist is not found'));
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.artist.delete({ where: { id } });
    this.loggingService.logResponse(HttpStatus.OK, {
      message: `Artist with ${id} deleted`,
    });
  }
}
