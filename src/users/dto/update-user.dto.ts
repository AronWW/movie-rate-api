import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John',
    description: 'Ім\'я',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Прізвище',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'URL аватара',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  avatar?: string;
}