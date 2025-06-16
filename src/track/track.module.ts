import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { PrismaModule } from '../prisma.module';
import { LoggingService } from '../logging.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TrackController],
  providers: [TrackService, LoggingService],
  exports: [TrackService],
})
export class TrackModule {}
