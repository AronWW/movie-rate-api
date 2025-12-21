import { IsInt, Min, Max } from 'class-validator';

export class UpdateRatingDto {
  @IsInt()
  @Min(1)
  @Max(10)
  score: number;
}