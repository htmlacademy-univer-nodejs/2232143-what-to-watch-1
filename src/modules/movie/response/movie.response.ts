import { Expose, Type } from 'class-transformer';
import { TGenre } from '../../../types/genre.type.js';
import UserResponse from '../../user/response/user.response.js';

export default class MovieResponse {
  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public published!: Date;

  @Expose()
  public genre!: TGenre;

  @Expose()
  public released!: number;

  @Expose()
  public rating!: number;

  @Expose()
  public previewVideoLink!: string;

  @Expose()
  public videoLink!: string;

  @Expose()
  public starring!: string[];

  @Expose()
  public director!: string;

  @Expose()
  public runTime!: number;

  @Type(() => UserResponse)
  public user!: UserResponse;

  @Expose()
  public posterImage!: string;

  @Expose()
  public backgroundImage!: string;

  @Expose()
  public backgroundColor!: string;

  @Expose()
  public commentsCount!: number;
}
