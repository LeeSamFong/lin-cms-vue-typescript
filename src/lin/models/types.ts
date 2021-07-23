export type ErrorMessageObject = {
  [k in string]: string
}

export interface UnifyErrorResponse {
  code: number;
  message: string | string[] | ErrorMessageObject;
  request: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
}
