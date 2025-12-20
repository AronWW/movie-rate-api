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
    const skip = (page - 1) * limit;

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
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.movie.count({ where }),
    ]);

    return {
      data: movies,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return movie;
  }

  async update(id: number, dto: UpdateMovieDto) {
    await this.findOne(id); // Перевірка існування

    return this.prisma.movie.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Перевірка існування

    return this.prisma.movie.delete({
      where: { id },
    });
  }
}