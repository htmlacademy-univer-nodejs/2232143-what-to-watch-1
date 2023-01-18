import { TUser } from '../../types/user.type.js';
import typegoose, { defaultClasses, getModelForClass } from '@typegoose/typegoose';
import { createSHA256, checkPassword } from '../../utils/common.js';

const { prop, modelOptions } = typegoose;

export interface UserEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})

export class UserEntity extends defaultClasses.TimeStamps implements TUser {
  constructor(data: TUser) {
    super();

    this.email = data.email;
    this.avatarUrl = data.avatarUrl;
    this.name = data.name;
  }

  @prop({ unique: true, required: true })
  public email!: string;

  @prop()
  public avatarUrl?: string;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  private password!: string;

  @prop({ required: true, default: [] })
  public moviesToWatch!: string[];

  setPassword(password: string, salt: string) {
    checkPassword(password);
    this.password = createSHA256(password, salt);
  }

  verifyPassword(password: string, salt: string) {
    return createSHA256(password, salt) === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
