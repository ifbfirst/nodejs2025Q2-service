import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { Favorites, FavoritesResponse } from 'src/interfaces';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class FavsService {
  constructor(
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
    private readonly trackService: TrackService,
  ) {}

  private favs: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  getAllFavs(): FavoritesResponse {
    const allFavorites = {
      artists: this.favs.artists
        .map((id) => {
          return this.artistService.getArtistById(id);
        })
        .filter((artist) => artist),

      albums: this.favs.albums
        .map((id) => {
          return this.albumService.getAlbumById(id);
        })
        .filter((album) => album),

      tracks: this.favs.tracks
        .map((id) => {
          return this.trackService.getTrackById(id);
        })
        .filter((track) => track),
    };

    return allFavorites;
  }

  createFavTrack(id: string) {
    const track = this.trackService.getTrackById(id);

    if (!track) {
      throw new HttpException(
        'Track does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    this.favs.tracks.push(id);
  }

  deleteFavTrack(id: string) {
    const track = this.favs.tracks.find((fav) => fav === id);

    if (!track) {
      throw new HttpException('Track is not found', HttpStatus.NOT_FOUND);
    }

    this.favs.tracks = this.favs.tracks.filter((t) => t !== id);
  }

  createFavArtist(id: string) {
    const artist = this.artistService.getArtistById(id);

    if (!artist) {
      throw new HttpException(
        'Artist does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    this.favs.artists.push(id);
  }

  deleteFavArtist(id: string) {
    const artist = this.favs.artists.find((fav) => fav === id);

    if (!artist) {
      throw new HttpException('Artist is not found', HttpStatus.NOT_FOUND);
    }

    this.favs.artists = this.favs.artists.filter((a) => a !== id);
  }

  createFavAlbum(id: string) {
    const album = this.albumService.getAlbumById(id);

    if (!album) {
      throw new HttpException(
        'Album does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    this.favs.albums.push(id);
  }

  deleteFavAlbum(id: string) {
    const album = this.favs.albums.find((fav) => fav === id);

    if (!album) {
      throw new HttpException('Album is not found', HttpStatus.NOT_FOUND);
    }

    this.favs.albums = this.favs.albums.filter((a) => a !== id);
  }
}
