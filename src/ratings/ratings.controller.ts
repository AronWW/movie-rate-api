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
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('ratings')
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: any, @Body() dto: CreateRatingDto) {
    return this.ratingsService.create(user.id, dto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMyRatings(@CurrentUser() user: any) {
    return this.ratingsService.findMyRatings(user.id);
  }

  @Get('movie/:movieId/average')
  getAverageRating(@Param('movieId', ParseIntPipe) movieId: number) {
    return this.ratingsService.getAverageRating(movieId);
  }

  @Get('movie/:movieId/my')
  @UseGuards(JwtAuthGuard)
  getMyRating(
    @CurrentUser() user: any,
    @Param('movieId', ParseIntPipe) movieId: number,
  ) {
    return this.ratingsService.getMyRating(user.id, movieId);
  }

  @Get('movie/:movieId/all')
  getAllRatingsByMovie(@Param('movieId', ParseIntPipe) movieId: number) {
    return this.ratingsService.getAllRatingsByMovie(movieId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
    @Body() dto: UpdateRatingDto,
  ) {
    return this.ratingsService.update(id, user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.ratingsService.remove(id, user.id);
  }
}