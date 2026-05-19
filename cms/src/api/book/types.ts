import type {Data} from "@strapi/strapi";

export type BookModelUIDType = 'api::book.book';

export const BookModelUID: BookModelUIDType = 'api::book.book'

export type BookEntry = Data.ContentType<BookModelUIDType>;
