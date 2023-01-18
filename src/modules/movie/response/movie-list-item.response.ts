import { Expose } from 'class-transformer';
import { TGenre } from '../../../types/genre.type';

export default class MovieListItemResponse {
  @Expose()
  public title!: string;

  @Expose()
  public published!: number;

  @Expose()
  public genre!: TGenre;

  @Expose()
  public previewVideoLink!: string;

  @Expose()
  public userId!: string;

  @Expose()
  public posterImage!: string;

  @Expose()
  public commentsCount!: number;
}
