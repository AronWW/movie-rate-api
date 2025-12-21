import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PaginationDto } from './dto/pagination.dto';
import { MovieEntity } from './entities/movie.entity';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Post()
  @ApiOperation({ summary: 'Створити новий фільм' })
  @ApiResponse({
    status: 201,
    description: 'Фільм успішно створено',
    type: MovieEntity,
  })
  create(@Body() dto: CreateMovieDto) {
    return this.moviesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати список фільмів' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false, example: 'Нолан' })
  @ApiResponse({
    status: 200,
    description: 'Список фільмів з пагінацією',
    schema: {
      example: {
        data: [
          {
            id: 1,
            title: 'Інтерстеллар',
            description: 'Опис...',
            genre: 'Sci-Fi',
            releaseYear: 2014,
            director: 'Крістофер Нолан',
            duration: 169,
            averageRating: 9.5,
            ratingsCount: 10,
            reviewsCount: 5,
          },
        ],
        meta: {
          total: 20,
          page: 1,
          limit: 10,
          totalPages: 2,
        },
      },
    },
  })
  findAll(@Query() pagination: PaginationDto) {
    return this.moviesService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати деталі фільму' })
  @ApiParam({ name: 'id', description: 'ID фільму', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Деталі фільму з рейтингами та рецензіями',
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити фільм' })
  @ApiParam({ name: 'id', description: 'ID фільму', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Фільм успішно оновлено',
    type: MovieEntity,
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMovieDto,
  ) {
    return this.moviesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити фільм' })
  @ApiParam({ name: 'id', description: 'ID фільму', example: 1 })
  @ApiResponse({ status: 200, description: 'Фільм успішно видалено' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.remove(id);
  }
}