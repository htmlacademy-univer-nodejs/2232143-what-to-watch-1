import { Genre } from './genre.enum';
import { TUser } from './user.type';

export type TMovie = {
    title: string;
    description: string;
    published: Date;
    genre: Genre;
    released: number;
    rating: number;
    previewVideoLink: string;
    videoLink: string;
    starring: string[];
    director: string;
    runTime: number;
    commentsCount: number;
    user: TUser;
    posterImage: string;
    backgroundImage: string;
    backgroundColor: string;
}
