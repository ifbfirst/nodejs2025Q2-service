import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { TrackModule } from '../track/track.module';
import { PrismaModule } from '../prisma.module';
import { LoggingService } from '../logging.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService, LoggingService],
  imports: [TrackModule, PrismaModule, AuthModule],
  exports: [AlbumService],
})
export class AlbumModule {}
