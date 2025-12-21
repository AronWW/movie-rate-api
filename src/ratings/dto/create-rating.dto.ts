import { IsInt, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @IsInt()
  movieId: number;

  @IsInt()
  @Min(1)
  @Max(10)
  score: number;
}