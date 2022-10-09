import { readFileSync } from 'fs';
import { Genre } from '../../types/genre.enum.js';
import { TMovie } from '../../types/movie.type.js';
import { FileReaderInterface } from './file-reader.interface.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) { }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf8' });
  }

  public toArray(): TMovie[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([
        title,
        description,
        published,
        genre,
        released,
        rating,
        previewVideoLink,
        videoLink,
        starring,
        director,
        runTime,
        commentsCount,
        name,
        email,
        avatarUrl,
        password,
        posterImage,
        backgroundImage,
        backgroundColor
      ]) => ({
        title,
        description,
        published: new Date(published),
        genre: Genre[genre as keyof typeof Genre],
        released: Number.parseInt(released, 10),
        rating: Number.parseFloat(rating),
        previewVideoLink,
        videoLink,
        starring: starring.split(','),
        director,
        runTime: Number.parseInt(runTime, 10),
        commentsCount: Number.parseInt(commentsCount, 10),
        user: {name, email, avatarUrl, password},
        posterImage,
        backgroundImage,
        backgroundColor
      }));
  }
}
