import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
  Post,
  Body,
  Delete,
  Put,
  HttpCode,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackService } from './track.service';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  getAllTracks() {
    return this.trackService.getAllTracks();
  }

  @Get(':id')
  getTrackById(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException(
        'Invalid track ID format',
        HttpStatus.BAD_REQUEST,
      );
    }

    const track = this.trackService.getTrackById(id);
    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    return track;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createTrack(@Body() createTrackDto: CreateTrackDto) {
    return this.trackService.createTrack(createTrackDto);
  }

  @Put(':id')
  updateTrack(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    if (!isUUID(id)) {
      throw new HttpException(
        'Invalid track ID format',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.trackService.updateTrack(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTrack(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException(
        'Invalid track ID format',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.trackService.deleteTrack(id);
  }
}
