import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Реєстрація нового користувача' })
  @ApiResponse({
    status: 201,
    description: 'Користувач успішно зареєстрований',
    schema: {
      example: {
        id: 1,
        email: 'user@example.com',
        username: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        avatar: null,
        createdAt: '2025-12-20T12:00:00.000Z',
        updatedAt: '2025-12-20T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'User already exists' })
  @ApiBody({ type: RegisterDto })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.fullName, dto.email, dto.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Авторизація користувача' })
  @ApiResponse({
    status: 200,
    description: 'Успішна авторизація',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(dto.email, dto.password, res);
  }
}