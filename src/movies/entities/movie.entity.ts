export class MovieEntity {
  id: number;
  title: string;
  description: string;
  genre: string;
  releaseYear: number;
  director: string;
  posterUrl?: string;
  duration: number;
  createdAt: Date;

  averageRating?: number;
  ratingsCount?: number;
  reviewsCount?: number;
  reviews?: Array<{
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    user: {
      id: number;
      username: string;
      avatar: string | null;
    };
  }>;
}