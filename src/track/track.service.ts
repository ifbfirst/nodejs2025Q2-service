import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Track } from 'src/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TrackService {
  private tracks: Track[] = [
    {
      id: uuidv4(),
      name: 'Soul',
      artistId: '1234',
      albumId: '5678',
      duration: 360,
    },
  ];

  getAllTracks() {
    return this.tracks;
  }

  getTrackById(id: string) {
    const track = this.tracks.find((t) => t.id === id);
    return track;
  }

  createTrack({ name, artistId, albumId, duration }: CreateTrackDto) {
    const track = {
      id: uuidv4(),
      name,
      artistId: artistId ?? null,
      albumId: albumId ?? null,
      duration,
    };
    this.tracks.push(track);
    console.log('Созданный трек:', track);
    return track;
  }

  updateTrack(
    id: string,
    { name, artistId, albumId, duration }: UpdateTrackDto,
  ) {
    const track = this.tracks.find((t) => t.id === id);

    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    if (name) track.name = name;
    if (artistId) track.artistId = artistId;
    if (albumId) track.albumId = albumId;
    if (duration) track.duration = duration;

    return track;
  }

  deleteTrack(id: string) {
    const track = this.tracks.find((track) => track.id === id);
    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    this.tracks = this.tracks.filter((t) => t.id !== id);
  }
}
