import {
  IsArray,
  IsBoolean,
  IsISO8601,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
} from 'class-validator';
import { MovieType } from '../schemas/movie.schema';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(MovieType)
  type: MovieType;

  @IsNumber()
  duration: number;

  @IsString()
  poster_url: string;

  @IsOptional()
  @IsString()
  trailer_url?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  rating?: number;

  @IsISO8601()
  release_date: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  directors?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cast?: string[];

  @IsOptional()
  @IsBoolean()
  is_featured?: boolean;
}
