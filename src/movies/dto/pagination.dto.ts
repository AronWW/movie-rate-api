import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @ApiProperty({
    required: false,
    default: 1,
    minimum: 1,
    description: 'Номер сторінки',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    required: false,
    default: 10,
    minimum: 1,
    description: 'Кількість елементів на сторінці',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    required: false,
    description: 'Пошуковий запит',
    example: 'Нолан',
  })
  @IsOptional()
  @IsString()
  search?: string;
}