import { IsString, IsInt, MinLength, MaxLength } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  movieId: number;

  @IsString()
  @MinLength(5)
  @MaxLength(100)
  title: string;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  content: string;
}