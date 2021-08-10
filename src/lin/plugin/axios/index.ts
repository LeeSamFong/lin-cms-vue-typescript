import axios, { AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import Config from '@/config'
import ErrorCode, { AccessTokenCodes, RefreshTokenCodes } from '@/config/error-code'
import autoJump from '@/lin/utils/auto-jump'
import FaultTolerance from '@/lin/plugin/axios/fault-tolerance'
import Permission from '@/lin/plugin/axios/permission'
import store from '@/store'
import { ErrorMessageObject, UnifyResponse } from '@/lin/models/data_type/response-types'
import { saveAccessToken } from '@/lin/utils/token'
import { TokensType } from '@/lin/models/data_type/user'

export interface LinAxiosRequestConfig extends AxiosRequestConfig {
  handleError?: boolean;
  showBackend?: boolean;
}

const config: AxiosRequestConfig = {
  baseURL: Config.baseURL || process.env.apiUrl || '',
  timeout: 5 * 1000, // 请求超时时间设置
  // withCredentials: true, // Check cross-site Access-Control
  // 定义可获得的http响应状态码
  // return true、设置为null或者undefined，promise将resolved,否则将rejected
  validateStatus(status: number) {
    return status >= 200 && status < 510
  },
}

/**
 * 错误码是否是refresh相关
 * @param {number} code 错误码
 */
function refreshTokenException(code: number) {
  return RefreshTokenCodes.includes(code)
}

/**
 * 错误码是否是access相关
 * @param {number} code 错误码
 */
function accessTokenException(code: number) {
  return AccessTokenCodes.includes(code)
}

const _axios = axios.create(config)

_axios.interceptors.request.use(
  originConfig => {
    // 有 API 请求重新计时
    autoJump()

    let reqConfig: LinAxiosRequestConfig = { ...originConfig }

    // step1: 容错处理
    reqConfig = FaultTolerance.processConfig(reqConfig)

    // step2: permission 处理
    reqConfig = Permission.getConfig(reqConfig)

    return reqConfig
  },
  error => Promise.reject(error),
)

_axios.interceptors.response.use(
  async res => {
    if (res.status.toString().charAt(0) === '2') {
      return res
    }

    const { code, message } = res.data as UnifyResponse

    // refresh_token 异常，直接登出
    if (refreshTokenException(code)) {
      setTimeout(() => {
        store.dispatch('logout')
        const { origin } = window.location
        window.location.href = origin
      }, 1500)

      return Promise.reject(res)
    }

    // assessToken相关，刷新令牌
    if (accessTokenException(code)) {
      const refreshResult = (await _axios.get<TokensType>('cms/user/refresh')).data
      saveAccessToken(refreshResult.access_token)

      // 将上次失败请求重发
      return _axios.request(res.config)
    }

    // 弹出信息提示的第一种情况：直接提示后端返回的异常信息（框架默认为此配置）；
    // 特殊情况：如果本次请求添加了 handleError: true，用户自行通过 try catch 处理，框架不做额外处理
    const config = res.config as LinAxiosRequestConfig
    if (config.handleError) {
      return Promise.reject(res)
    }

    let tipMessage: string

    // 弹出信息提示的第二种情况：采用前端自己定义的一套异常提示信息（需自行在配置项开启）；
    // 特殊情况：如果本次请求添加了 showBackend: true, 弹出后端返回错误信息。
    if (Config.useFrontEndErrorMsg && !config.showBackend) {
      // 弹出前端自定义错误信息
      const errMsg = ErrorCode[code]
      // 匹配到前端自定义的错误码
      tipMessage = errMsg ?? ErrorCode['777']
    }

    function joinMsg(msg: string[], sign = '，') {
      return msg.join(sign)
    }

    switch (Object.prototype.toString.call(message)) {
      case '[object String]':
        tipMessage = message as string
        break

      case '[object Object]':
        joinMsg(Object.values(message as ErrorMessageObject).flat())
        tipMessage = joinMsg(Object.values(message as ErrorMessageObject).flat())
        break

      case '[object Array]':
        tipMessage = joinMsg((message as string[]))
        break

      default:
        tipMessage = ErrorCode['999']
    }

    ElMessage.error(tipMessage)

    return Promise.reject(res)
  },
  error => {
    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }
    if (!error.response) {
      ElMessage.error('请检查 API 是否正常')
      console.error('error: ', error)
    }

    // 判断请求超时
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      ElMessage.warning('请求超时')
    }
    return Promise.reject(error)
  },
)


function linAxios<T>(config: LinAxiosRequestConfig): Promise<T>;
function linAxios<T>(url: string, config?: LinAxiosRequestConfig): Promise<T>;
function linAxios<T>(param1: string | LinAxiosRequestConfig, param2?: LinAxiosRequestConfig): Promise<T> {
  let config: LinAxiosRequestConfig = param2 || {}
  if (typeof param1 === 'string') {
    config.url = param1
  } else {
    config = param1
  }

  return _axios.request<T>(config).then(res => res.data)
}

linAxios.interceptors = _axios.interceptors
linAxios.request = <T>(config: AxiosRequestConfig) => linAxios<T>(config)

/**
 * 创造每个请求方式的核心方法
 */
function createRequestMethod<T>(url: string, method: LinAxiosRequestConfig['method'], config?: LinAxiosRequestConfig) {
  let reqConfig: LinAxiosRequestConfig = {}
  if (config) {
    reqConfig = { ...config }
  }
  reqConfig.method = method
  reqConfig.url = url
  return linAxios<T>(reqConfig)
}

linAxios.get = <T>(url: string, config?: LinAxiosRequestConfig) => createRequestMethod<T>(url, 'get', config)
linAxios.post = <T>(url: string, config?: LinAxiosRequestConfig) => createRequestMethod<T>(url, 'post', config)
linAxios.put = <T>(url: string, config?: LinAxiosRequestConfig) => createRequestMethod<T>(url, 'put', config)
linAxios.delete = <T>(url: string, config?: LinAxiosRequestConfig) => createRequestMethod<T>(url, 'delete', config)
linAxios.head = <T>(url: string, config?: LinAxiosRequestConfig) => createRequestMethod<T>(url, 'head', config)
linAxios.options = <T>(url: string, config?: LinAxiosRequestConfig) => createRequestMethod<T>(url, 'options', config)
linAxios.patch = <T>(url: string, config?: LinAxiosRequestConfig) => createRequestMethod<T>(url, 'patch', config)
linAxios.getUri = _axios.getUri

export default linAxios
