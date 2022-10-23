import { getGenre } from '../types/genre.type.js';
import { TMovie } from '../types/movie.type.js';
import crypto from 'crypto';

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
    backgroundColor
  };
};

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';

export const createSHA256 = (line: string, salt: string): string =>
  crypto.createHmac('sha256', salt).update(line).digest('hex');
