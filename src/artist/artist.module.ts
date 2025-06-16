import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { TrackModule } from '../track/track.module';
import { AlbumModule } from '../album/album.module';
import { PrismaModule } from '../prisma.module';
import { LoggingService } from '../logging.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TrackModule, AlbumModule, PrismaModule, AuthModule],
  controllers: [ArtistController],
  providers: [ArtistService, LoggingService],
  exports: [ArtistService],
})
export class ArtistModule {}
