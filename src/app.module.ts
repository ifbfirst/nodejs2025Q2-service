import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TrackModule } from './track/track.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { FavsModule } from './favs/favs.module';
import { PrismaService } from './prisma.service';
import { LoggingService } from './logging.service';

@Module({
  imports: [UserModule, TrackModule, ArtistModule, AlbumModule, FavsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, LoggingService],
})
export class AppModule {}
