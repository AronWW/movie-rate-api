import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
