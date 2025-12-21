import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private async hash(data: string) {
    return bcrypt.hash(data, 10);
  }

  private async verify(data: string, hash: string) {
    return bcrypt.compare(data, hash);
  }

  private generateTokens(userId: number, email: string) {
    const payload = { sub: userId, email };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_TOKEN_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async register(fullName: string, email: string, password: string) {
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new BadRequestException('User already exists');

    const [firstName, lastName] = fullName.split(' ');

    return this.prisma.user.create({
      data: {
        email,
        username: email,
        firstName,
        lastName,
        password: await this.hash(password),
      },
    });
  }

  async login(email: string, password: string, res: Response) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await this.verify(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = this.generateTokens(user.id, user.email);
    const hashedRefresh = await this.hash(tokens.refreshToken);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefresh },
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken: tokens.accessToken };
  }
}
