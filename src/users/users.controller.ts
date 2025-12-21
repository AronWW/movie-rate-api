import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Отримати поточного користувача' })
  @ApiResponse({
    status: 200,
    description: 'Інформація про поточного користувача',
    type: UserEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMe(@CurrentUser() user: any) {
    return user;
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Оновити профіль користувача' })
  @ApiResponse({
    status: 200,
    description: 'Профіль успішно оновлено',
    type: UserEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateProfile(@CurrentUser() user: any, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати публічний профіль користувача' })
  @ApiParam({ name: 'id', description: 'ID користувача', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Публічний профіль користувача',
    type: UserEntity,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }
}