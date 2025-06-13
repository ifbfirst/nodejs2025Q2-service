import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!request.headers.authorization) {
      console.log('Authorization header is missing!');
    }

    if (!token) {
      throw new UnauthorizedException('Authorization token missing');
    }

    try {
      console.log('Verifying token:', token);
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
      console.log('Verified Token:', decoded);
      return true;
    } catch (error) {
      console.log('Token verification failed ❌', error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
