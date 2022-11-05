import { TGenre } from './genre.type.js';
import { TUser } from './user.type.js';

export type TMovie = {
  title: string;
  description: string;
  published: Date;
  genre: TGenre;
  released: number;
  rating: number;
  previewVideoLink: string;
  videoLink: string;
  starring: string[];
  director: string;
  runTime: number;
  user: TUser;
  posterImage: string;
  backgroundImage: string;
  backgroundColor: string;
  isPromo?: boolean;
  commentsCount: number;
}
