import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateReviewDto) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: dto.movieId },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    // Перевірка чи користувач вже писав рецензію до цього фільму
    const existingReview = await this.prisma.review.findFirst({
      where: {
        userId,
        movieId: dto.movieId,
      },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this movie');
    }

    return this.prisma.review.create({
      data: {
        title: dto.title,
        content: dto.content,
        userId,
        movieId: dto.movieId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
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

  async findAllByMovie(movieId: number) {
    // Перевірка що фільм існує
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return this.prisma.review.findMany({
      where: { movieId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
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

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(id: number, userId: number, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Перевірка що користувач є автором рецензії
    if (review.userId !== userId) {
      throw new ForbiddenException('You can only edit your own reviews');
    }

    return this.prisma.review.update({
      where: { id },
      data: dto,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
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
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Перевірка що користувач є автором рецензії
    if (review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.prisma.review.delete({
      where: { id },
    });

    return { message: 'Review deleted successfully' };
  }
}