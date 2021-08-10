export type ErrorMessageObject = {
  [k in string]: string
}

export interface UnifyResponse {
  code: number;
  message: string | string[] | ErrorMessageObject;
  request: string;
}

export interface UnifyPageResponse<T> {
  total: number;
  items: T[];
  page: number;
  count: number;
}
