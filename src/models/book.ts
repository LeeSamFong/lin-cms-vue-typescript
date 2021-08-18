import linAxios from '@/lin/plugin/axios'
import { UnifyResponse } from '@/lin/models/data_type/response-types'
import { BookType, CreateOrUpdateBookType } from '@/models/types/book'

class BookModel {
  static async createBook(data: CreateOrUpdateBookType) {
    return linAxios<UnifyResponse>({
      url: 'v1/book',
      method: 'post',
      data,
    })
  }

  static async getBooks() {
    return linAxios<BookType[]>('v1/book')
  }

  static async getBook(id: number) {
    return linAxios<BookType>(`v1/book/${id}`)
  }

  static async editBook(id: number, info: CreateOrUpdateBookType) {
    return linAxios<UnifyResponse>({
      url: `v1/book/${id}`,
      method: 'put',
      data: info,
    })
  }

  static async deleteBook(id: number) {
    return linAxios<UnifyResponse>({
      url: `v1/book/${id}`,
      method: 'delete',
    })
  }
}


export default BookModel
