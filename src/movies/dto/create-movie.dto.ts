import { IsString, IsOptional, IsEnum, IsArray, IsNumber, IsDate } from 'class-validator';
import { MovieType } from '../schemas/movie.schema';
import { Type } from 'class-transformer';

class ImdbDto {
  @IsNumber()
  rating: number;

  @IsNumber()
  votes: number;

  @IsNumber()
  id: number;
}

class AwardDto {
  @IsNumber()
  wins: number;

  @IsNumber()
  nominations: number;

  @IsString()
  text: string;
}

class TomatoesViewerDto {
  @IsNumber()
  rating: number;

  @IsNumber()
  numReviews: number;

  @IsNumber()
  meter: number;
}

class TomatoesCriticDto {
  @IsNumber()
  rating: number;

  @IsNumber()
  numReviews: number;

  @IsNumber()
  meter: number;
}

class TomatoesDto {
  @IsOptional()
  @Type(() => TomatoesViewerDto)
  viewer: TomatoesViewerDto;

  @IsOptional()
  @Type(() => TomatoesCriticDto)
  critic: TomatoesCriticDto;

  @IsOptional()
  @IsNumber()
  fresh: number;

  @IsOptional()
  @IsNumber()
  rotten: number;

  @IsOptional()
  @IsDate()
  lastUpdated: Date;
}

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  plot?: string;

  @IsOptional()
  @IsString()
  fullplot?: string;

  @IsOptional()
  @IsString()
  rated?: string;

  @IsOptional()
  @IsString()
  poster?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cast?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  directors?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  countries?: string[];

  @IsOptional()
  @IsEnum(MovieType)
  type?: MovieType;

  @IsOptional()
  @IsNumber()
  runtime?: number;

  @IsOptional()
  @IsDate()
  released?: Date;

  @IsOptional()
  @IsNumber()
  year?: number;

  @IsOptional()
  @Type(() => AwardDto)
  awards?: AwardDto;

  @IsOptional()
  @Type(() => ImdbDto)
  imdb?: ImdbDto;

  @IsOptional()
  @Type(() => TomatoesDto)
  tomatoes?: TomatoesDto;
}
