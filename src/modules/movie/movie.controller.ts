import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.type.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { fillDTO } from '../../utils/common.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import UpdateMovieDto from './dto/update-movie.dto.js';
import { MovieServiceInterface } from './movie-service.interface.js';
import { MovieRoute } from './movie-route.js';
import MovieResponse from './response/movie.response.js';
import * as core from 'express-serve-static-core';
import { DocumentExistsMiddleware } from '../../middlewares/document-exists.middleware.js';
import { ValidateDtoMiddleware } from '../../middlewares/validate-dto.middleware.js';
import { ValidateObjectIdMiddleware } from '../../middlewares/validate-objectid.middleware.js';
import { CommentServiceInterface } from '../comment/comment-service.interface.js';
import CommentResponse from '../comment/response/comment.response.js';
import { DocumentType } from '@typegoose/typegoose/lib/types.js';
import { getGenre, TGenre } from '../../types/genre.type.js';
import { MovieEntity } from './movie.entity.js';
import MovieListItemResponse from './response/movie-list-item.response.js';
import { StatusCodes } from 'http-status-codes';
import HttpError from '../../common/errors/http-error.js';
import { PrivateRouteMiddleware } from '../../middlewares/private-route.middleware.js';
import { UserServiceInterface } from '../user/user-service.interface.js';

type ParamsGetMovie = {
  movieId: string;
};

type QueryParamsGetMovies = {
  limit?: string;
  genre?: TGenre;
};

@injectable()
export default class MovieController extends Controller {
  constructor(@inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.MovieServiceInterface) private readonly movieService: MovieServiceInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface) {
    super(logger);

    this.logger.info('Register routes for MovieController.');

    this.addRoute<MovieRoute>({ path: MovieRoute.PROMO, method: HttpMethod.Get, handler: this.showPromo });
    this.addRoute<MovieRoute>({ path: MovieRoute.ROOT, method: HttpMethod.Get, handler: this.index });
    this.addRoute<MovieRoute>({
      path: MovieRoute.CREATE,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(this.userService),
        new ValidateDtoMiddleware(CreateMovieDto)
      ]
    });
    this.addRoute<MovieRoute>({
      path: MovieRoute.MOVIE,
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId'),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId')
      ]
    });
    this.addRoute<MovieRoute>({
      path: MovieRoute.MOVIE,
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(this.userService),
        new ValidateObjectIdMiddleware('movieId'),
        new ValidateDtoMiddleware(UpdateMovieDto),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId')
      ]
    });
    this.addRoute<MovieRoute>({
      path: MovieRoute.MOVIE,
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(this.userService),
        new ValidateObjectIdMiddleware('movieId'),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId')
      ]
    });
    this.addRoute<MovieRoute>({
      path: MovieRoute.COMMENTS,
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId'),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId'),
      ]
    });
  }

  async index(req: Request<unknown, unknown, unknown, QueryParamsGetMovies>, res: Response): Promise<void> {
    const genre = req.query.genre;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
    let movies: DocumentType<MovieEntity>[];
    if (genre) {
      movies = await this.movieService.findByGenre(getGenre(genre), limit);
    } else {
      movies = await this.movieService.find(limit);
    }
    const movieResponse = fillDTO(MovieListItemResponse, movies);
    this.ok(res, movieResponse);
  }

  async create(req: Request<Record<string, unknown>, Record<string, unknown>, CreateMovieDto>, res: Response): Promise<void> {
    const { body, user } = req;
    const result = await this.movieService.create(body, user.id);
    const movie = await this.movieService.findById(result.id);
    this.created(res, fillDTO(MovieResponse, movie));
  }

  async show({ params }: Request<core.ParamsDictionary | ParamsGetMovie>, res: Response): Promise<void> {
    const result = await this.movieService.findById(params.movieId);
    this.ok(res, fillDTO(MovieResponse, result));
  }

  async update(req: Request<core.ParamsDictionary | ParamsGetMovie, Record<string, unknown>, UpdateMovieDto>, res: Response): Promise<void> {
    const { params, body, user } = req;
    const movie = await this.movieService.findById(params.movieId);
    if (movie?.user?.id !== user.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `User with id ${user.id} doesn't own movie card with id ${movie?.id}, so can't edit it.`,
        'MovieController'
      );
    }
    const result = await this.movieService.updateById(params.movieId, body);
    this.ok(res, fillDTO(MovieResponse, result));
  }

  async delete(req: Request<core.ParamsDictionary | ParamsGetMovie>, res: Response): Promise<void> {
    const { params, user } = req;
    const movie = await this.movieService.findById(params.movieId);
    if (movie?.user?.id !== user.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `User with id ${user.id} doesn't own movie card with id ${movie?.id}, so can't delete it.`,
        'MovieController'
      );
    }
    await this.movieService.deleteById(`${params.movieId}`);
    this.noContent(res, { message: 'Фильм успешно удален.' });
  }

  async showPromo(_: Request, res: Response): Promise<void> {
    const result = await this.movieService.findPromo();
    this.ok(res, fillDTO(MovieResponse, result));
  }

  async getComments({ params }: Request<core.ParamsDictionary | ParamsGetMovie>, res: Response): Promise<void> {
    const comments = await this.commentService.findByMovieId(params.movieId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }
}
