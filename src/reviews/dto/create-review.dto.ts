import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 1, description: 'ID фільму' })
  @IsInt()
  movieId: number;

  @ApiProperty({
    example: 'Неймовірний фільм!',
    description: 'Заголовок рецензії',
    minLength: 5,
    maxLength: 100,
  })
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  title: string;

  @ApiProperty({
    example: 'Інтерстеллар - це шедевр Крістофера Нолана...',
    description: 'Текст рецензії',
    minLength: 10,
    maxLength: 2000,
  })
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  content: string;
}