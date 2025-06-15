import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from 'src/users/schemas/user.schema';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('movies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CONTENT_CREATOR)
  async create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  async findAll(@Query('type') type?: string) {
    if (type) {
      return this.moviesService.findByType(type);
    }
    return this.moviesService.findAll();
  }

  @Get('featured')
  async findFeatured() {
    return this.moviesService.findFeatured();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.moviesService.delete(id);
  }

  @Post(':id/view')
  async incrementViewCount(@Param('id') id: string) {
    return this.moviesService.incrementViewCount(id);
  }
}
