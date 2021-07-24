export interface TokensType {
  access_token: string;
  refresh_token: string;
}

export interface UserType {
  admin: boolean;
  avatar: string;
  email: null | string;
  id: number;
  nickname: string;
  permissions: {
    [k in string]: {
      module: string;
      permission: string;
    }[];
  }[];
}
