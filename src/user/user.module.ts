import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma.module';
import { LoggingService } from '../logging.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, LoggingService],
})
export class UserModule {}
