import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from 'src/users/schemas/user.schema';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Movie } from './schemas/movie.schema';

@Controller('movies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CONTENT_CREATOR)
  async create(@Body() dto: CreateMovieDto, @Request() req): Promise<Movie> {
    const userId = req.user?.id || req.user?._id;
    return this.movieService.create(dto, userId);
  }

  @Get()
  async findAll(): Promise<Movie[]> {
    return this.movieService.findAll();
  }

  @Get('search')
  async search(@Query('query') query: string): Promise<Movie[]> {
    return this.movieService.searchByTitle(query);
  }

  @Get('filter')
  async filter(@Query('type') type: string, @Query('genre') genre?: string): Promise<Movie[]> {
    return this.movieService.filterByTypeAndGenre(type, genre);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Movie> {
    return this.movieService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_CREATOR)
  async update(@Param('id') id: string, @Body() dto: UpdateMovieDto): Promise<Movie> {
    return this.movieService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_CREATOR)
  async remove(@Param('id') id: string): Promise<void> {
    await this.movieService.remove(id);
  }
}
