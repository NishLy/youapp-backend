import { IsString, IsNotEmpty, MinLength, IsEmail } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
