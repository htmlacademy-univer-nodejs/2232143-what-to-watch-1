import { getGenre } from '../types/genre.type.js';
import { TMovie } from '../types/movie.type.js';
import crypto from 'crypto';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export const createMovie = (row: string): TMovie => {
  const tokens = row.replace('\n', '').split('\t');
  const [
    title, description, published, genre,
    released, rating, previewVideoLink, videoLink,
    starring, director, runTime,
    name, email, avatarUrl, posterImage,
    backgroundImage, backgroundColor
  ] = tokens;

  return {
    title,
    description,
    published: new Date(published),
    genre: getGenre(genre),
    released: Number.parseInt(released, 10),
    rating: Number.parseFloat(rating),
    previewVideoLink,
    videoLink,
    starring: starring.split(','),
    director,
    runTime: Number.parseInt(runTime, 10),
    user: { name, email, avatarUrl },
    posterImage,
    backgroundImage,
    backgroundColor,
    commentsCount: 0
  };
};

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';

export const createSHA256 = (line: string, salt: string): string =>
  crypto.createHmac('sha256', salt).update(line).digest('hex');

export const checkPassword = (password: string) => {
  if (password.length < 6 || password.length > 12) {
    throw new Error('Password should be from 6 to 12 characters');
  }
};

export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });

export const createErrorObject = (message: string) => ({
  error: message,
});
