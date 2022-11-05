import typegoose, { defaultClasses, getModelForClass, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js';
import { GENRE_ARRAY, TGenre } from '../../types/genre.type.js';

const { prop, modelOptions } = typegoose;

export interface MovieEntity extends defaultClasses.Base { }

@modelOptions({
  schemaOptions: {
    collection: 'movies'
  }
})
export class MovieEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true, minlength: 2, maxlength: 100 })
  public title!: string;

  @prop({ trim: true, required: true, minlength: 20, maxlength: 1024 })
  public description!: string;

  @prop({ required: true })
  public published!: Date;

  @prop({
    type: () => String,
    required: true,
    enum: GENRE_ARRAY
  })
  public genre!: TGenre;

  @prop({ required: true })
  public released!: number;

  @prop({ required: true, default: 0 })
  public rating!: number;

  @prop({ required: true })
  public previewVideoLink!: string;

  @prop({ required: true })
  public videoLink!: string;

  @prop({ required: true })
  public starring!: string[];

  @prop({ required: true, minlength: 2, maxlength: 50 })
  public director!: string;

  @prop({ required: true })
  public runTime!: number;

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({ required: true, match: /([^\s]+(\.jpg)$)/ })
  public posterImage!: string;

  @prop({ required: true, match: /([^\s]+(\.jpg)$)/ })
  public backgroundImage!: string;

  @prop({ required: true })
  public backgroundColor!: string;

  @prop()
  public isPromo?: boolean;

  @prop({default: 0})
  public commentsCount!: number;
}

export const MovieModel = getModelForClass(MovieEntity);
