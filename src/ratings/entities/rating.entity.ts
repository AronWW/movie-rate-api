export class RatingEntity {
  id: number;
  score: number;
  userId: number;
  movieId: number;
  createdAt: Date;

  user?: {
    id: number;
    username: string;
  };

  movie?: {
    id: number;
    title: string;
  };
}