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
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsString()
  genre: string;

  @IsNumber()
  @Min(1900)
  @Max(2100)
  releaseYear: number;

  @IsString()
  director: string;

  @IsOptional()
  @IsUrl()
  posterUrl?: string;

  @IsNumber()
  @Min(1)
  duration: number;
}