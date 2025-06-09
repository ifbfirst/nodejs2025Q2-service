import { IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(4)
  oldPassword: string;

  @IsString()
  @MinLength(4)
  newPassword: string;
}
