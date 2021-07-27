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

export interface GroupsType {
  /**
   * 分组名称，例如：搬砖者
   */
  name: string;

  /**
   * 分组信息：例如：搬砖的人
   */
  info: string;

  /**
   * 1: 超级管理员
   * 2: 游客
   * 3: 普通用户
   */
  level: 1 | 2 | 3;
}

export interface UserInfoType {
  id: number;

  /**
   * 用户名，唯一
   */
  username: string;

  /**
   * 用户昵称
   */
  nickname: string;

  /**
   * 头像url
   */
  avatar: string;

  /**
   * 邮箱
   */
  email: string;

  /**
   * 分组
   */
  groups: GroupsType[];
}
