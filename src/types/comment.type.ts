import { TUser } from './user.type';

export type TComment = {
comment: string;
rating: number;
date: Date
user: TUser
}
