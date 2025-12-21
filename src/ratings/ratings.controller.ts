import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { RatingEntity } from './entities/rating.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Ratings')
@Controller('ratings')
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Поставити оцінку фільму' })
  @ApiResponse({
    status: 201,
    description: 'Оцінка успішно додана',
    type: RatingEntity,
  })
  @ApiResponse({
    status: 409,
    description: 'You have already rated this movie',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  create(@CurrentUser() user: any, @Body() dto: CreateRatingDto) {
    return this.ratingsService.create(user.id, dto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Отримати мої оцінки' })
  @ApiResponse({
    status: 200,
    description: 'Список моїх оцінок',
    type: [RatingEntity],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findMyRatings(@CurrentUser() user: any) {
    return this.ratingsService.findMyRatings(user.id);
  }

  @Get('movie/:movieId/average')
  @ApiOperation({ summary: 'Отримати середній рейтинг фільму' })
  @ApiParam({ name: 'movieId', description: 'ID фільму', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Середній рейтинг та статистика',
    schema: {
      example: {
        movieId: 1,
        movieTitle: 'Інтерстеллар',
        averageRating: 9.5,
        totalRatings: 10,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  getAverageRating(@Param('movieId', ParseIntPipe) movieId: number) {
    return this.ratingsService.getAverageRating(movieId);
  }

  @Get('movie/:movieId/my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Отримати мою оцінку фільму' })
  @ApiParam({ name: 'movieId', description: 'ID фільму', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Моя оцінка фільму',
    type: RatingEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Movie not found or not rated' })
  getMyRating(
    @CurrentUser() user: any,
    @Param('movieId', ParseIntPipe) movieId: number,
  ) {
    return this.ratingsService.getMyRating(user.id, movieId);
  }

  @Get('movie/:movieId/all')
  @ApiOperation({ summary: 'Отримати всі оцінки фільму' })
  @ApiParam({ name: 'movieId', description: 'ID фільму', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Список всіх оцінок фільму',
    type: [RatingEntity],
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  getAllRatingsByMovie(@Param('movieId', ParseIntPipe) movieId: number) {
    return this.ratingsService.getAllRatingsByMovie(movieId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Оновити свою оцінку' })
  @ApiParam({ name: 'id', description: 'ID оцінки', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Оцінка успішно оновлена',
    type: RatingEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'You can only update your own ratings' })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
    @Body() dto: UpdateRatingDto,
  ) {
    return this.ratingsService.update(id, user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Видалити свою оцінку' })
  @ApiParam({ name: 'id', description: 'ID оцінки', example: 1 })
  @ApiResponse({ status: 200, description: 'Оцінка успішно видалена' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'You can only delete your own ratings' })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.ratingsService.remove(id, user.id);
  }
}