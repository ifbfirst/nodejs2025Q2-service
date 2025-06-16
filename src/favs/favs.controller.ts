import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
  Post,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { FavsService } from './favs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  getAllFavs() {
    return this.favsService.getAllFavs();
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  createFavTrack(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException(
        'Invalid track ID format',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.favsService.createFavTrack(id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteFavTrack(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException(
        'Invalid track ID format',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.favsService.deleteFavTrack(id);
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  createFavArtist(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException(
        'Invalid artist ID format',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.favsService.createFavArtist(id);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteFavArtist(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException(
        'Invalid artist ID format',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.favsService.deleteFavArtist(id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  createFavAlbum(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException(
        'Invalid track ID format',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.favsService.createFavAlbum(id);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteFavAlbum(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException(
        'Invalid album ID format',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.favsService.deleteFavAlbum(id);
  }
}
