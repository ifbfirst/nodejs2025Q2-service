import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
  Post,
  Body,
  Delete,
  Put,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { validate as isUUID } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid user ID format', HttpStatus.BAD_REQUEST);
    }

    const user = this.userService.getUserById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto.login || !createUserDto.password) {
      throw new HttpException(
        'Login and password are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.userService.createUser(
      createUserDto.login,
      createUserDto.password,
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateUserPassword(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid user ID format', HttpStatus.BAD_REQUEST);
    }

    return this.userService.updateUserPassword(
      id,
      updateUserDto.newPassword,
      updateUserDto.oldPassword,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid user ID format', HttpStatus.BAD_REQUEST);
    }

    return this.userService.deleteUser(id);
  }
}
