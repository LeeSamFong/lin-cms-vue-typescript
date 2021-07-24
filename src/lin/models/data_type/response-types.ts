export type ErrorMessageObject = {
  [k in string]: string
}

export interface UnifyErrorResponse {
  code: number;
  message: string | string[] | ErrorMessageObject;
  request: string;
}
