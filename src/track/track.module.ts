import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { PrismaModule } from '../prisma.module';
import { LoggingService } from '../logging.service';

@Module({
  imports: [PrismaModule],
  controllers: [TrackController],
  providers: [TrackService, LoggingService],
  exports: [TrackService],
})
export class TrackModule {}
