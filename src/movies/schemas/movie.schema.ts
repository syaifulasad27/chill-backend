import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MovieDocument = Movie & Document;

export enum MovieType {
  MOVIE = 'movie',
  SERIES = 'series',
  DOCUMENTARY = 'documentary',
  ANIMATION = 'animation',
}
@Schema({ _id: false })
class Award {
  @Prop()
  wins: number;

  @Prop()
  nominations: number;

  @Prop()
  text: string;
}

@Schema({ _id: false })
class Imdb {
  @Prop()
  rating: number;

  @Prop()
  votes: number;

  @Prop()
  id: number;
}

@Schema({ _id: false })
class TomatoesViewer {
  @Prop()
  rating: number;

  @Prop()
  numReviews: number;

  @Prop()
  meter: number;
}

@Schema({ _id: false })
class TomatoesCritic {
  @Prop()
  rating: number;

  @Prop()
  numReviews: number;

  @Prop()
  meter: number;
}

@Schema({ _id: false })
class Tomatoes {
  @Prop({ type: TomatoesViewer })
  viewer: TomatoesViewer;

  @Prop({ type: TomatoesCritic })
  critic: TomatoesCritic;

  @Prop()
  fresh: number;

  @Prop()
  rotten: number;

  @Prop()
  lastUpdated: Date;
}

@Schema({ timestamps: true })
export class Movie {
  @Prop({ required: true })
  title: string;

  @Prop()
  plot: string;

  @Prop()
  fullplot: string;

  @Prop([String])
  genres: string[];

  @Prop([String])
  cast: string[];

  @Prop([String])
  directors: string[];

  @Prop([String])
  languages: string[];

  @Prop([String])
  countries: string[];

  @Prop()
  rated: string;

  @Prop()
  runtime: number;

  @Prop()
  poster: string;

  @Prop()
  released: Date;

  @Prop()
  year: number;

  @Prop({ type: Award })
  awards?: Award;

  @Prop({ type: Imdb })
  imdb?: Imdb;

  @Prop({ type: Tomatoes })
  tomatoes?: Tomatoes;

  @Prop()
  num_mflix_comments?: number;

  @Prop({ enum: MovieType, default: MovieType.MOVIE })
  type: MovieType;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  created_by?: Types.ObjectId; // untuk track who created the movie
}

export const MovieSchema = SchemaFactory.createForClass(Movie);

MovieSchema.index({ type: 1, released: -1 });
MovieSchema.index({ genres: 1, year: -1 });
MovieSchema.index({ title: 'text', plot: 'text', fullplot: 'text' });
MovieSchema.index({ 'imdb.rating': -1 });
MovieSchema.index({ created_by: 1 });
