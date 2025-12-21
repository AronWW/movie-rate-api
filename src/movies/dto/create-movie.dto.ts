import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'Інтерстеллар', description: 'Назва фільму' })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    example: 'Космічна одіссея про порятунок людства',
    description: 'Опис фільму',
    minLength: 10,
  })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({ example: 'Sci-Fi', description: 'Жанр фільму' })
  @IsString()
  genre: string;

  @ApiProperty({
    example: 2014,
    description: 'Рік випуску',
    minimum: 1900,
    maximum: 2100,
  })
  @IsNumber()
  @Min(1900)
  @Max(2100)
  releaseYear: number;

  @ApiProperty({ example: 'Крістофер Нолан', description: 'Режисер' })
  @IsString()
  director: string;

  @ApiProperty({
    example: 'https://example.com/poster.jpg',
    description: 'URL постера',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  posterUrl?: string;

  @ApiProperty({
    example: 169,
    description: 'Тривалість у хвилинах',
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  duration: number;
}