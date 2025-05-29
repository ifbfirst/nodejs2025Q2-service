import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/interfaces';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  private users: User[] = [
    {
      id: uuidv4(),
      login: 'admin',
      password: '1234',
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];

  getAllUsers() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return this.users.map(({ password, ...rest }) => rest);
  }

  getUserById(id: string) {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { ...user, password: undefined };
  }

  createUser(login: string, password: string) {
    const user = {
      id: uuidv4(),
      login: login,
      password: password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.users.push(user);
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  updateUserPassword(id: string, newPassword: string, oldPassword: string) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (oldPassword !== user.password) {
      throw new HttpException(
        'Passwords have to be equal',
        HttpStatus.FORBIDDEN,
      );
    }
    user.password = newPassword;
    user.version += 1;
    user.updatedAt = Date.now();
    return { ...user, password: undefined };
  }

  deleteUser(id: string) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    this.users = this.users.filter((u) => u.id !== id);
  }
}
