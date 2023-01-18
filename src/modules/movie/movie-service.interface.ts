import { DocumentType } from '@typegoose/typegoose';
import { MovieEntity } from './movie.entity.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import UpdateMovieDto from './dto/update-movie.dto.js';
import { DocumentExistsInterface } from '../../types/document-exists.interface.js';

export interface MovieServiceInterface extends DocumentExistsInterface {
  create(dto: CreateMovieDto, userId: string): Promise<DocumentType<MovieEntity>>;
  findById(movieId: string): Promise<DocumentType<MovieEntity> | null>;
  find(limit?: number): Promise<DocumentType<MovieEntity>[]>;
  updateById(movieId: string, dto: UpdateMovieDto): Promise<DocumentType<MovieEntity> | null>;
  deleteById(movieId: string): Promise<void | null>;
  findByGenre(genre: string, limit?: number): Promise<DocumentType<MovieEntity>[]>;
  findPromo(): Promise<DocumentType<MovieEntity> | null>;
  incCommentsCount(movieId: string): Promise<void | null>;
  updateMovieRating(movieId: string, newRating: number): Promise<void | null>;
}
