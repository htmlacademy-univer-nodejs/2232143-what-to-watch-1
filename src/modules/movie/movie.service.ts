import { inject, injectable } from 'inversify';
import { MovieServiceInterface } from './movie-service.interface.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { MovieEntity } from './movie.entity.js';
import { Component } from '../../types/component.type.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import UpdateMovieDto from './dto/update-movie.dto.js';
import { MAX_MOVIES_COUNT } from './movie.constant.js';
import { TGenre } from '../../types/genre.type.js';

@injectable()
export default class MovieService implements MovieServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.MovieModel) private readonly movieModel: types.ModelType<MovieEntity>
  ) { }

  async create(dto: CreateMovieDto, user: string): Promise<DocumentType<MovieEntity>> {
    const movie = await this.movieModel.create({ ...dto, user });
    this.logger.info(`New movie created: ${dto.title}`);

    return movie;
  }

  async findById(movieId: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findById(movieId).populate('user');
  }

  async find(limit?: number): Promise<DocumentType<MovieEntity>[]> {
    const movies = await this.movieModel.aggregate([
      { $sort: { publishingDate: 1 } },
      { $limit: limit || MAX_MOVIES_COUNT }
    ]);
    return this.movieModel.populate(movies, 'user');
  }

  async updateById(movieId: string, dto: UpdateMovieDto): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findByIdAndUpdate(movieId, dto, { new: true }).populate('user');
  }

  async deleteById(movieId: string): Promise<void | null> {
    return this.movieModel.findByIdAndDelete(movieId);
  }

  async findByGenre(genre: TGenre, limit?: number): Promise<DocumentType<MovieEntity>[]> {
    return this.movieModel.find({ genre }, {}, { limit }).populate('user');
  }

  async findPromo(): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findOne({ isPromo: true }).populate('user');
  }

  async incCommentsCount(movieId: string): Promise<void | null> {
    return this.movieModel.findByIdAndUpdate(movieId, { $inc: { commentsCount: 1 } });
  }

  async updateMovieRating(movieId: string, newRating: number): Promise<void | null> {
    const oldValues = await this.movieModel.findById(movieId).select('rating commentsCount');
    const oldRating = oldValues?.['rating'] ?? 0;
    const oldCommentsCount = oldValues?.['commentsCount'] ?? 0;
    return this.movieModel.findByIdAndUpdate(movieId, {
      rating: (oldRating * oldCommentsCount + newRating) / (oldCommentsCount + 1)
    });
  }

  async exists(documentId: string): Promise<boolean> {
    return (await this.movieModel.exists({ _id: documentId })) !== null;
  }
}
