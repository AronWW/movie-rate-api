import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateRatingDto) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: dto.movieId },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    const existingRating = await this.prisma.rating.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId: dto.movieId,
        },
      },
    });

    if (existingRating) {
      throw new ConflictException(
        'You have already rated this movie. Use PATCH to update your rating.',
      );
    }

    return this.prisma.rating.create({
      data: {
        score: dto.score,
        userId,
        movieId: dto.movieId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        movie: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async getAverageRating(movieId: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    const result = await this.prisma.rating.aggregate({
      where: { movieId },
      _avg: {
        score: true,
      },
      _count: {
        id: true,
      },
    });

    return {
      movieId,
      movieTitle: movie.title,
      averageRating: result._avg.score ? Number(result._avg.score.toFixed(1)) : 0,
      totalRatings: result._count.id,
    };
  }

  async getMyRating(userId: number, movieId: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    const rating = await this.prisma.rating.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
      include: {
        movie: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!rating) {
      throw new NotFoundException('You have not rated this movie yet');
    }

    return rating;
  }

  async update(id: number, userId: number, dto: UpdateRatingDto) {
    const rating = await this.prisma.rating.findUnique({
      where: { id },
    });

    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    if (rating.userId !== userId) {
      throw new ForbiddenException('You can only update your own ratings');
    }

    return this.prisma.rating.update({
      where: { id },
      data: { score: dto.score },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        movie: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async remove(id: number, userId: number) {
    const rating = await this.prisma.rating.findUnique({
      where: { id },
    });

    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    if (rating.userId !== userId) {
      throw new ForbiddenException('You can only delete your own ratings');
    }

    await this.prisma.rating.delete({
      where: { id },
    });

    return { message: 'Rating deleted successfully' };
  }

  async getAllRatingsByMovie(movieId: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return this.prisma.rating.findMany({
      where: { movieId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}