import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMovieDto) {
    return this.prisma.movie.create({
      data: dto,
    });
  }

async findAll(pagination: PaginationDto) {
  const { page = 1, limit = 10, search } = pagination;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
          { director: { contains: search, mode: 'insensitive' as const } },
          { genre: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [movies, total] = await Promise.all([
    this.prisma.movie.findMany({
      where,
      skip,
      take: limitNum, 
      orderBy: { createdAt: 'desc' },
      include: {
        ratings: {
          select: {
            score: true,
          },
        },
        reviews: {
          select: {
            id: true,
          },
        },
      },
    }),
    this.prisma.movie.count({ where }),
  ]);

  const moviesWithRatings = movies.map((movie) => {
    const totalRatings = movie.ratings.length;
    const averageRating =
      totalRatings > 0
        ? Number(
            (
              movie.ratings.reduce((sum, r) => sum + r.score, 0) /
              totalRatings
            ).toFixed(1),
          )
        : 0;

    const { ratings, reviews, ...movieData } = movie;

    return {
      ...movieData,
      averageRating,
      ratingsCount: totalRatings,
      reviewsCount: reviews.length,
    };
  });

  return {
    data: moviesWithRatings,
    meta: {
      total,
      page: pageNum, 
      limit: limitNum, 
      totalPages: Math.ceil(total / limitNum), 
    },
  };
}
  async findOne(id: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: {
        ratings: {
          select: {
            score: true,
          },
        },
        reviews: {
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    const totalRatings = movie.ratings.length;
    const averageRating =
      totalRatings > 0
        ? Number(
            (
              movie.ratings.reduce((sum, r) => sum + r.score, 0) / totalRatings
            ).toFixed(1),
          )
        : 0;

    const { ratings, ...movieData } = movie;

    return {
      ...movieData,
      averageRating,
      ratingsCount: totalRatings,
      reviewsCount: movie.reviews.length,
    };
  }

  async update(id: number, dto: UpdateMovieDto) {
    await this.findOne(id); 

    return this.prisma.movie.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); 

    return this.prisma.movie.delete({
      where: { id },
    });
  }
}