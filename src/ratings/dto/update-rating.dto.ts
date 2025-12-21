import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max } from 'class-validator';

export class UpdateRatingDto {
  @ApiProperty({
    example: 10,
    description: 'Оновлена оцінка від 1 до 10',
    minimum: 1,
    maximum: 10,
  })
  @IsInt()
  @Min(1)
  @Max(10)
  score: number;
}