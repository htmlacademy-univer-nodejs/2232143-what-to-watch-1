import { Expose, Type } from 'class-transformer';
import { TGenre } from '../../../types/genre.type.js';
import UserResponse from '../../user/response/user.response.js';

export default class MovieListItemResponse {
  @Expose()
  public title!: string;

  @Expose()
  public published!: number;

  @Expose()
  public genre!: TGenre;

  @Expose()
  public previewVideoLink!: string;

  @Type(() => UserResponse)
  public user!: UserResponse;

  @Expose()
  public posterImage!: string;

  @Expose()
  public commentsCount!: number;
}
