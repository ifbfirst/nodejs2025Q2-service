import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { TrackModule } from '../track/track.module';
import { PrismaModule } from '../prisma.module';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService],
  imports: [TrackModule, PrismaModule],
  exports: [AlbumService],
})
export class AlbumModule {}
