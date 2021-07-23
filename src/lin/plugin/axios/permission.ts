import { AxiosRequestConfig } from 'axios'
import { getAccessToken, getRefreshToken } from '@/lin/utils/token'
import UrlConfig from '@/config/url'

class Permission {
  private readonly _config: AxiosRequestConfig

  get config(): AxiosRequestConfig {
    return this._config
  }

  static getConfig(config: AxiosRequestConfig) {
    return new Permission(config).config
  }

  constructor(reqConfig: AxiosRequestConfig) {
    this._config = { ...reqConfig }

    this.setToken()
  }

  setToken() {
    let token: string | null

    if (this._config.url === UrlConfig.REFRESH) {
      token = getRefreshToken()
    } else {
      token = getAccessToken()
    }

    if (token) {
      this._config.headers.Authorization = token
    }
  }
}

export default Permission
