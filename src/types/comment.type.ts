import { TUser } from './user.type.js';

export type TComment = {
comment: string;
rating: number;
date: Date
user: TUser
}
