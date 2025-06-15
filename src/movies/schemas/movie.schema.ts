import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MovieDocument = Movie & Document;

export enum MovieType {
  MOVIE = 'movie',
  SERIES = 'series',
  DOCUMENTARY = 'documentary',
  ANIMATION = 'animation',
}

@Schema({ timestamps: true })
export class Movie {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: String,
    enum: MovieType,
    default: MovieType.MOVIE,
  })
  type: MovieType;

  @Prop({ required: true }) // dalam menit
  duration: number;

  @Prop({ required: true })
  poster_url: string;

  @Prop()
  trailer_url: string;

  @Prop({ default: 0, min: 0, max: 10 })
  rating: number;

  @Prop({ required: true })
  release_date: Date;

  @Prop({ type: [String], default: [] })
  genres: string[];

  @Prop({ type: [String], default: [] })
  directors: string[];

  @Prop({ type: [String], default: [] })
  cast: string[];

  @Prop({ default: false })
  is_featured: boolean;

  @Prop({ default: 0 })
  view_count: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  created_by: Types.ObjectId; // untuk track who created the movie
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
