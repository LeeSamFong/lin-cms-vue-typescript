export interface FileType {
  /**
   * 文件 id
   */
  id: number;

  /**
   * 文件 key，上传时指定的
   */
  key: string;

  /**
   * 文件路径
   */
  path: string;

  /**
   * 文件 URL
   */
  url: string;
}
