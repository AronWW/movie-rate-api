import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  content?: string;
}