import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateAccessToken(userId: string, login: string): string {
    return jwt.sign({ userId, login }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });
  }

  generateRefreshToken(userId: string, login: string): string {
    return jwt.sign({ userId, login }, process.env.JWT_SECRET_KEY, {
      expiresIn: '7d',
    });
  }
}
