import { User } from "../user/userTypes";

export interface Book {
    _id: string;
    title: string;
    author: User;
    genre: string;
    coverImage: string;
    file: string;
    likesCount: { type: Number, default: 0 }
    like:string;
    createdAt:Date;
    updateAt:Date;

}