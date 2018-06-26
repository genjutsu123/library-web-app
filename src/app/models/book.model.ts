import { Author } from "./Author.model";
import { Shelve } from "./Shelve.model";
import { Genre } from "./Genre.model";
export class Book {
    id: number = 0;
    name: string = '';
    author: Author;
    genre: Genre;
    shelf: Shelve;
    stock: number = 0;
}