import linAxios from '@/lin/plugin/axios'
import { TokensType, UserType } from '@/lin/models/data_type/user'
import { saveTokens } from '@/lin/utils/token'
import store from '@/store'
import { State } from '@/store/state'

class UserModel {
  /**
   * 登录获取tokens
   * @param username 用户名
   * @param password 密码
   */
  static async getToken(username: string, password: string) {
    const tokens = await linAxios<TokensType>({
      url: 'cms/user/login',
      data: {
        username,
        password,
      },
    })
    saveTokens(tokens.access_token, tokens.refresh_token)
    return tokens
  }

  /**
   * 获取当前用户信息和所拥有的权限
   */
  static async getPermissions(): Promise<UserType> {
    const info = await linAxios<UserType>('cms/user/permission')
    const storeUser = store.getters.user as State['user']
    return { ...storeUser, ...info }
  }
}

export default UserModel
