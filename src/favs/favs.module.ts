import { Module } from '@nestjs/common';
import { FavsController } from './favs.controller';
import { FavsService } from './favs.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { TrackService } from '../track/track.service';
import { PrismaModule } from '../prisma.module';
import { LoggingService } from '../logging.service';

@Module({
  imports: [PrismaModule],
  controllers: [FavsController],
  providers: [
    FavsService,
    AlbumService,
    ArtistService,
    TrackService,
    LoggingService,
  ],
})
export class FavsModule {}
