import { Module } from '@nestjs/common';
import { FavsController } from './favs.controller';
import { FavsService } from './favs.service';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { TrackService } from 'src/track/track.service';

@Module({
  controllers: [FavsController],
  providers: [FavsService, AlbumService, ArtistService, TrackService],
})
export class FavsModule {}
