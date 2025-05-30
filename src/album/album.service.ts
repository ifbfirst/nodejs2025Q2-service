import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Album } from 'src/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { TrackService } from 'src/track/track.service';

let albums: Album[] = [];

@Injectable()
export class AlbumService {
  constructor(private readonly trackService: TrackService) {}

  getAllAlbums() {
    return albums;
  }

  getAlbumById(id: string) {
    const album = albums.find((t) => t.id === id);
    return album;
  }

  createAlbum({ name, artistId, year }: CreateAlbumDto) {
    const album = {
      id: uuidv4(),
      name,
      artistId: artistId ?? null,
      year: year,
    };
    albums.push(album);
    return album;
  }

  updateAlbum(id: string, { name, artistId, year }: UpdateAlbumDto) {
    const album = albums.find((a) => a.id === id);

    if (!album) {
      throw new HttpException('Album is not found', HttpStatus.NOT_FOUND);
    }
    if (name) album.name = name;
    if (artistId) album.artistId = artistId;
    if (year) album.year = year;

    return album;
  }

  deleteAlbum(id: string) {
    const album = albums.find((album) => album.id === id);
    if (!album) {
      throw new HttpException('Album is not found', HttpStatus.NOT_FOUND);
    }

    albums = albums.filter((t) => t.id !== id);

    this.trackService.updateAlbumId(id);
  }

  updateArtistId(artistId: string) {
    albums = albums.map((album) =>
      album.artistId === artistId ? { ...album, artistId: null } : album,
    );
  }
}
