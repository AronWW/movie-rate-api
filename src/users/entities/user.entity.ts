import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'user@example.com' })
  username: string;

  @ApiProperty({ example: 'John', required: false })
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  lastName?: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  avatar?: string;

  @ApiProperty({ example: '2025-12-20T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-12-20T12:00:00.000Z' })
  updatedAt: Date;
}