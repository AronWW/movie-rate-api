import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateReviewDto {
  @ApiProperty({
    example: 'Оновлена назва рецензії',
    description: 'Заголовок рецензії',
    required: false,
    minLength: 5,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  title?: string;

  @ApiProperty({
    example: 'Оновлений текст рецензії...',
    description: 'Текст рецензії',
    required: false,
    minLength: 10,
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  content?: string;
}