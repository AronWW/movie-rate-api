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
}