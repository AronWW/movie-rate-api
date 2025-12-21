import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty({ example: 1, description: 'ID фільму' })
  @IsInt()
  movieId: number;

  @ApiProperty({
    example: 9,
    description: 'Оцінка від 1 до 10',
    minimum: 1,
    maximum: 10,
  })
  @IsInt()
  @Min(1)
  @Max(10)
  score: number;
}