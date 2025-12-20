export class ReviewEntity {
  id: number;
  title: string;
  content: string;
  userId: number;
  movieId: number;
  createdAt: Date;
  updatedAt: Date;

  user?: {
    id: number;
    username: string;
    avatar: string | null;
  };

  movie?: {
    id: number;
    title: string;
  };
}