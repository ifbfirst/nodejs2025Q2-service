import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Artist } from 'src/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';

@Injectable()
export class ArtistService {
  constructor(
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
  ) {}
  private artists: Artist[] = [
    {
      id: uuidv4(),
      name: 'Jule',
      grammy: true,
    },
  ];

  getAllArtists() {
    return this.artists;
  }

  getArtistById(id: string) {
    const artist = this.artists.find((a) => a.id === id);
    return artist;
  }

  createArtist({ name, grammy }: CreateArtistDto) {
    const artist = {
      id: uuidv4(),
      name,
      grammy,
    };
    this.artists.push(artist);
    return artist;
  }

  updateArtist(id: string, { name, grammy }: UpdateArtistDto) {
    const artist = this.artists.find((a) => a.id === id);

    if (!artist) {
      throw new HttpException('Artist is not found', HttpStatus.NOT_FOUND);
    }

    if (name) artist.name = name;
    if (grammy !== undefined && grammy !== null) {
      artist.grammy = grammy;
    }

    return artist;
  }

  deleteArtist(id: string) {
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new HttpException('Artist is not found', HttpStatus.NOT_FOUND);
    }

    this.artists = this.artists.filter((a) => a.id !== id);

    this.trackService.updateArtistId(id);
    this.albumService.updateArtistId(id);
  }
}
