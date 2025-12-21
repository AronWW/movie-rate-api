export class UserEntity {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}