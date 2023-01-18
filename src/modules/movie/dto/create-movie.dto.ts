import { IsArray, IsDateString, IsEnum, IsInt, IsMongoId, IsString, Length, Matches, Max, Min, IsBoolean } from 'class-validator';
import { GenreEnum, TGenre } from '../../../types/genre.type.js';

export default class CreateMovieDto {
  @Length(2, 100, { message: 'title lenght must be from 2 to 100 symbols' })
  public title!: string;

  @Length(20, 1024, { message: 'description length must be from 20 to 1024 symbols' })
  public description!: string;

  @IsDateString({}, { message: 'published must be valid ISO date' })
  public published!: Date;

  @IsEnum(GenreEnum, { message: 'genre must be one of: \'comedy\', \'crime\', \'documentary\', \'drama\', \'horror\', \'family\', \'romance\', \'scifi\', \'thriller\'' })
  public genre!: TGenre;

  @IsInt({ message: 'released must be an integer' })
  @Min(1895, { message: 'Minimum released is 1895' })
  @Max(2022, { message: 'Maximum released is 2022' })
  public released!: number;

  @IsString({ message: 'previewVideoLink is required' })
  public previewVideoLink!: string;

  @IsString({ message: 'videoLink is required' })
  public videoLink!: string;

  @IsArray({ message: 'Field starring must be an array' })
  public starring!: string[];

  @IsString({ message: 'director is required' })
  public director!: string;

  @IsInt({ message: 'runTime must be an integer' })
  @Min(0, { message: 'runTime can not be less than 0' })
  public runTime!: number;

  @IsMongoId({ message: 'userId field must be valid an id' })
  public userId!: string;

  @Matches(/(\S+(\.jpg)$)/, { message: 'posterImage must be .jpg format image' })
  @IsString({ message: 'posterImage is required' })
  public posterImage!: string;

  @Matches(/(\S+(\.jpg)$)/, { message: 'backgroundImage must be .jpg format image' })
  @IsString({ message: 'backgroundImage is required' })
  public backgroundImage!: string;

  @IsString({ message: 'backgroundColor is required' })
  public backgroundColor!: string;

  @IsBoolean({ message: 'isPromo should be boolean' })
  public isPromo?: boolean;
}
