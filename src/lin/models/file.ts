import linAxios, { LinAxiosRequestConfig } from '@/lin/plugin/axios'
import { FileType } from '@/lin/models/data_type/file'

class FileModel {
  static async uploadFile(file: File, options?: LinAxiosRequestConfig) {
    return linAxios<FileType[]>({
      ...options,
      url: 'cms/file',
      method: 'post',
      data: {
        file,
      },
    })
  }
}


export default FileModel
