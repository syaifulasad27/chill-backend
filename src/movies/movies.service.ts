import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<MovieDocument>) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const createdMovie = new this.movieModel(createMovieDto);
    return createdMovie.save();
  }

  async findAll(): Promise<Movie[]> {
    return this.movieModel.find().exec();
  }

  async findOne(id: string): Promise<Movie> {
    return this.movieModel.findById(id).exec();
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    return this.movieModel.findByIdAndUpdate(id, updateMovieDto, { new: true }).exec();
  }

  async delete(id: string): Promise<Movie> {
    return this.movieModel.findByIdAndDelete(id).exec();
  }

  async incrementViewCount(id: string): Promise<Movie> {
    return this.movieModel.findByIdAndUpdate(id, { $inc: { view_count: 1 } }, { new: true }).exec();
  }

  async findFeatured(): Promise<Movie[]> {
    return this.movieModel.find({ is_featured: true }).exec();
  }

  async findByType(type: string): Promise<Movie[]> {
    return this.movieModel.find({ type }).exec();
  }
}
