import { StatusCodes } from 'http-status-codes';
import HttpError from '../common/errors/http-error.js';

export const GENRE_ARRAY = ['Comedy', 'Crime', 'Documentary', 'Drama', 'Horror', 'Family', 'Romance', 'Scifi', 'Thriller'];

export type TGenre = typeof GENRE_ARRAY[number];

export function getGenre(value: string): TGenre | never {
  if (!GENRE_ARRAY.includes(value)) {
    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `Unrecognised genre: ${value}.`,
      'getGenre'
    );
  }
  return value;
}

export enum GenreEnum {
  COMEDY = 'comedy',
  CRIME = 'crime',
  DOCUMENTARY = 'documentary',
  DRAMA = 'drama',
  HORROR = 'horror',
  FAMILY = 'family',
  ROMANCE = 'romance',
  SCIFI = 'scifi',
  THRILLER = 'thriller'
}
