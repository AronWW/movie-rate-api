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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewEntity } from './entities/review.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Створити рецензію до фільму' })
  @ApiResponse({
    status: 201,
    description: 'Рецензія успішно створена',
    type: ReviewEntity,
  })
  @ApiResponse({ status: 400, description: 'You have already reviewed this movie' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  create(@CurrentUser() user: any, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(user.id, dto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Отримати мої рецензії' })
  @ApiResponse({
    status: 200,
    description: 'Список моїх рецензій',
    type: [ReviewEntity],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findMyReviews(@CurrentUser() user: any) {
    return this.reviewsService.findMyReviews(user.id);
  }

  @Get('movie/:movieId')
  @ApiOperation({ summary: 'Отримати всі рецензії фільму' })
  @ApiParam({ name: 'movieId', description: 'ID фільму', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Список рецензій фільму',
    type: [ReviewEntity],
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  findAllByMovie(@Param('movieId', ParseIntPipe) movieId: number) {
    return this.reviewsService.findAllByMovie(movieId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати одну рецензію' })
  @ApiParam({ name: 'id', description: 'ID рецензії', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Деталі рецензії',
    type: ReviewEntity,
  })
  @ApiResponse({ status: 404, description: 'Review not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Оновити свою рецензію' })
  @ApiParam({ name: 'id', description: 'ID рецензії', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Рецензія успішно оновлена',
    type: ReviewEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'You can only edit your own reviews' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(id, user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Видалити свою рецензію' })
  @ApiParam({ name: 'id', description: 'ID рецензії', example: 1 })
  @ApiResponse({ status: 200, description: 'Рецензія успішно видалена' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'You can only delete your own reviews' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.reviewsService.remove(id, user.id);
  }
}