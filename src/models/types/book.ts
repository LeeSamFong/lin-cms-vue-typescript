export interface BookType {
  id: number;
  title: string;
  author: string;
  summary: string;
  image: string;
}

export type CreateOrUpdateBookType =
  Omit<BookType, 'id' | 'image'>
  & Partial<Pick<BookType, 'image'>>
