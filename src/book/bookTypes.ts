import { User } from "../user/userTypes";

export interface Book {
    _id: string;
    titles: string;
    author: User;
    genre: string;
    coverImage: string;
    file: string;
    createdAt:Date;
    updateAt:Date;

}