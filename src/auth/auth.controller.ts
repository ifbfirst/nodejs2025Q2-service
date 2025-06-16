import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

interface CustomJwtPayload extends JwtPayload {
  userId: string;
  login: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('signup')
  async signup(
    @Body() { login, password }: { login: string; password: string },
  ) {
    if (
      !login ||
      !password ||
      typeof login !== 'string' ||
      typeof password !== 'string'
    ) {
      throw new BadRequestException('Invalid login or password');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { login },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await this.authService.hashPassword(password);

    try {
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

      const accessToken = this.authService.generateAccessToken(
        user.id,
        user.login,
      );
      const refreshToken = this.authService.generateRefreshToken(
        user.id,
        user.login,
      );

      return {
        id: user.id,
        login: user.login,
        version: user.version,
        createdAt: new Date(user.createdAt).getTime(),
        updatedAt: new Date(user.updatedAt).getTime(),
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating user: ' + error.message,
      );
    }
  }

  @Post('login')
  async login(
    @Body() { login, password }: { login: string; password: string },
  ) {
    const user = await this.prisma.user.findUnique({ where: { login } });
    if (!user) return { statusCode: 403, message: 'User not found' };

    const passwordMatches = await this.authService.comparePasswords(
      password,
      user.password,
    );
    if (!passwordMatches)
      return { statusCode: 403, message: 'Invalid password' };

    const accessToken = this.authService.generateAccessToken(
      user.id,
      user.login,
    );
    const refreshToken = this.authService.generateRefreshToken(
      user.id,
      user.login,
    );

    return { accessToken, refreshToken };
  }

  @Post('refresh')
  async refresh(@Body() { refreshToken }: { refreshToken: string }) {
    if (!refreshToken) {
      return { statusCode: 401, message: 'Refresh token required' };
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET_KEY,
      ) as CustomJwtPayload;
      const newAccessToken = this.authService.generateAccessToken(
        decoded.userId,
        decoded.login,
      );
      const newRefreshToken = this.authService.generateRefreshToken(
        decoded.userId,
        decoded.login,
      );

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch {
      return { statusCode: 403, message: 'Invalid or expired refresh token' };
    }
  }
}
