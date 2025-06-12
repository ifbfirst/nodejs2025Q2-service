import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LoggingService } from '../logging.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly loggingService: LoggingService,
  ) {}

  async getAllUsers() {
    this.loggingService.logRequest('GET', '/user', {}, {});

    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    this.loggingService.logResponse(200, users);
    return users;
  }

  async getUserById(id: string) {
    this.loggingService.logRequest('GET', `/user/${id}`, {}, {});
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      this.loggingService.logError(new Error('User not found'));
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    this.loggingService.logResponse(200, user);
    return user;
  }

  async createUser(login: string, password: string) {
    this.loggingService.logRequest('POST', '/user', {}, { login });
    await this.prisma.user.deleteMany({ where: { login } });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { login, password: hashedPassword, version: 1 },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    this.loggingService.logResponse(201, user);
    return {
      ...user,
      createdAt: new Date(user.createdAt).getTime(),
      updatedAt: new Date(user.updatedAt).getTime(),
    };
  }

  async updateUserPassword(
    id: string,
    newPassword: string,
    oldPassword: string,
  ) {
    this.loggingService.logRequest(
      'PUT',
      `/users/${id}`,
      {},
      { oldPassword, newPassword },
    );
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      this.loggingService.logError(new Error('User not found'));
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      this.loggingService.logError(
        new Error(`Incorrect password for user: ${id}`),
      );
      throw new HttpException('Incorrect password', HttpStatus.FORBIDDEN);
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: hashedNewPassword,
        version: user.version + 1,
      },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    this.loggingService.logResponse(200, updatedUser);
    return {
      ...updatedUser,
      version: Number(updatedUser.version),
      createdAt: new Date(updatedUser.createdAt).getTime(),
      updatedAt: new Date(updatedUser.updatedAt).getTime(),
    };
  }

  async deleteUser(id: string) {
    this.loggingService.logRequest('DELETE', `/user/${id}`, {}, {});
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      this.loggingService.logError(new Error('User not found'));
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.user.delete({ where: { id } });
    this.loggingService.logResponse(200, {
      message: `User with ${id} deleted`,
    });
  }
}
