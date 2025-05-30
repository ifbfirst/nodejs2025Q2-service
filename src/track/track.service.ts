import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Track } from 'src/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

let globalTracks: Track[] = [];

@Injectable()
export class TrackService {
  getAllTracks() {
    return globalTracks;
  }

  getTrackById(id: string) {
    const track = globalTracks.find((t) => t.id === id);
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
    globalTracks.push(track);

    return track;
  }

  updateTrack(
    id: string,
    { name, artistId, albumId, duration }: UpdateTrackDto,
  ) {
    const track = globalTracks.find((t) => t.id === id);

    if (!track) {
      throw new HttpException('Track is not found', HttpStatus.NOT_FOUND);
    }
    if (name) track.name = name;
    if (artistId) track.artistId = artistId;
    if (albumId) track.albumId = albumId;
    if (duration) track.duration = duration;

    return track;
  }

  deleteTrack(id: string) {
    const track = globalTracks.find((track) => track.id === id);
    if (!track) {
      throw new HttpException('Track is not found', HttpStatus.NOT_FOUND);
    }

    globalTracks = globalTracks.filter((t) => t.id !== id);
  }

  updateArtistId(artistId: string) {
    globalTracks = globalTracks.map((track) =>
      track.artistId === artistId ? { ...track, artistId: null } : track,
    );
  }

  updateAlbumId(albumId: string) {
    globalTracks = globalTracks.map((track) =>
      track.albumId === albumId ? { ...track, albumId: null } : track,
    );
  }
}
