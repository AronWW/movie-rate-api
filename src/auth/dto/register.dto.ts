import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Повне ім\'я користувача',
    minLength: 2,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  fullName: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email користувача',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Пароль (мінімум 8 символів)',
    minLength: 8,
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}