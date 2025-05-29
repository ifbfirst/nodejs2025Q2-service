import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Album } from 'src/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class AlbumService {
  constructor(private readonly trackService: TrackService) {}

  private albums: Album[] = [
    {
      id: uuidv4(),
      name: 'first',
      year: 1999,
      artistId: '123',
    },
  ];

  getAllAlbums() {
    return this.albums;
  }

  getAlbumById(id: string) {
    const track = this.albums.find((t) => t.id === id);
    return track;
  }

  createAlbum({ name, artistId, year }: CreateAlbumDto) {
    const album = {
      id: uuidv4(),
      name,
      artistId: artistId ?? null,
      year: year,
    };
    this.albums.push(album);
    return album;
  }

  updateAlbum(id: string, { name, artistId, year }: UpdateAlbumDto) {
    const album = this.albums.find((a) => a.id === id);

    if (!album) {
      throw new HttpException('Album is not found', HttpStatus.NOT_FOUND);
    }
    if (name) album.name = name;
    if (artistId) album.artistId = artistId;
    if (year) album.year = year;

    return album;
  }

  deleteAlbum(id: string) {
    const album = this.albums.find((album) => album.id === id);
    if (!album) {
      throw new HttpException('Album is not found', HttpStatus.NOT_FOUND);
    }

    this.albums = this.albums.filter((t) => t.id !== id);

    this.trackService.updateAlbumId(id);
  }

  updateArtistId(artistId: string) {
    this.albums = this.albums.map((album) =>
      album.artistId === artistId ? { ...album, artistIdId: null } : album,
    );
  }
}
