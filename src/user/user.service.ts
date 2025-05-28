import { Injectable } from '@nestjs/common';
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
    if (!user) throw new Error('User not found');
    return { ...user, password: undefined };
  }
}
