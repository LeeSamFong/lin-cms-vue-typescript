import linAxios from '@/lin/plugin/axios'
import { TokensType, UserInfoType, UserType } from '@/lin/models/data_type/user'
import { saveTokens } from '@/lin/utils/token'

class UserModel {
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
}

export default UserModel
