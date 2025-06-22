import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<MovieDocument>) {}

  async create(dto: CreateMovieDto, createdBy: string) {
    const created = new this.movieModel({
      ...dto,
      created_by: createdBy,
    });
    return created.save();
  }

  async findAll() {
    return this.movieModel.find().sort({ released: -1 }).limit(100);
  }

  async findById(id: string) {
    return this.movieModel.findById(id);
  }

  async searchByTitle(keyword: string) {
    return this.movieModel
      .find({
        $text: { $search: keyword },
      })
      .limit(100);
  }

  async filterByTypeAndGenre(type: string, genre?: string) {
    const filter: any = { type };

    if (genre) {
      filter.genres = { $in: [new RegExp(genre, 'i')] }; // insensitive match
    }
    console.log(filter);

    return this.movieModel.find(filter).sort({ released: -1 }).limit(100);
  }

  async update(id: string, dto: UpdateMovieDto) {
    return this.movieModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async remove(id: string) {
    return this.movieModel.findByIdAndDelete(id);
  }
}
