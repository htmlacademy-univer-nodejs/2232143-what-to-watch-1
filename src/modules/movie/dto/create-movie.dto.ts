import { TGenre } from '../../../types/genre.type.js';

export default class CreateMovieDto {
  public title!: string;
  public description!: string;
  public published!: Date;
  public genre!: TGenre;
  public released!: number;
  public rating!: number;
  public previewVideoLink!: string;
  public videoLink!: string;
  public starring!: string[];
  public director!: string;
  public runTime!: number;
  public userId!: string;
  public posterImage!: string;
  public backgroundImage!: string;
  public backgroundColor!: string;
}
