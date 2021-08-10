import linAxios from '@/lin/plugin/axios'
import { TokensType, UserInfoType, UserType } from '@/lin/models/data_type/user'
import { saveTokens } from '@/lin/utils/token'
import { UnifyResponse } from '@/lin/models/data_type/response-types'

class UserModel {
  static async register(user: {
    email: string;
    username: string;
    password: string;
    groupIds: number[];
    confirmPassword: string;
  }) {
    return linAxios<UnifyResponse>({
      url: 'cms/user/register',
      method: 'post',
      data: {
        email: user.email,
        username: user.username,
        password: user.password,
        group_ids: user.groupIds,
        confirm_password: user.confirmPassword,
      },
    })
  }

  /**
   * 登录获取tokens
   * @param username 用户名
   * @param password 密码
   */
  static async getToken(username: string, password: string) {
    const tokens = await linAxios<TokensType>({
      url: 'cms/user/login',
      method: 'post',
      data: {
        username,
        password,
      },
    })
    saveTokens(tokens.access_token, tokens.refresh_token)
    return tokens
  }

  /**
   * 获取当前用户信息
   */
  static async getInformation() {
    return linAxios<UserInfoType>('cms/user/information')
  }

  /**
   * 获取当前用户信息和所拥有的权限
   */
  static async getPermissions(): Promise<UserType> {
    return linAxios<UserType>('cms/user/permissions')
  }

  static async updateUserInfo(userInfo: {
    email?: string;
    nickname?: string;
    username?: string;
    avatar?: string;
  }) {
    await linAxios({
      url: 'cms/user',
      method: 'put',
      data: {
        ...userInfo,
      },
    })
  }

  /**
   * 用户修改密码
   * @param form
   */
  static updatePassword(form: {
    old_password: string;
    new_password: string;
    confirm_password: string;
  }) {
    return linAxios({
      url: 'cms/user/change_password',
      method: 'put',
      data: {
        ...form,
      },
    })
  }
}

export default UserModel
