import { AxiosRequestConfig } from 'axios'

class FaultTolerance {
  private readonly _config: AxiosRequestConfig

  get config(): AxiosRequestConfig {
    return this._config
  }

  static processConfig(reqConfig: AxiosRequestConfig): AxiosRequestConfig {
    return new FaultTolerance(reqConfig).config
  }

  constructor(reqConfig: AxiosRequestConfig) {
    const config = { ...reqConfig }
    this._config = config

    if (!config.url) {
      console.error('request need url')
      throw new Error('request need url')
    }

    // 大小写容错
    this.methodToLowerCase()

    // 参数容错
    switch (config.method) {
      case 'get':
        this.processWithGet()
        break
      case 'post':
        this.processWithPost()
        break
      default:
        // TODO: 其他类型请求数据格式处理
        console.warn(`其他请求类型: ${config.method}, 暂无自动处理`)
    }
  }

  /**
   * 大小写容错
   */
  private methodToLowerCase() {
    const { _config } = this

    if (!_config.method) {
      // 默认使用 get 请求
      _config.method = 'get'
    }
    // 大小写容错
    _config.method = _config.method.toLowerCase() as typeof _config.method
  }

  /**
   * Get请求容错
   */
  private processWithGet() {
    const { _config } = this

    if (!_config.params) {
      // 防止字段用错
      _config.params = _config.data || {}
    }
  }

  /**
   * Post请求容错
   */
  private processWithPost() {
    const { _config } = this

    if (!_config.data) {
      // 防止字段用错
      _config.data = _config.params || {}
    }

    // 检测是否包含文件类型, 若包含则进行 formData 封装
    let hasFile = false
    Object.keys(_config.data).forEach(key => {
      if (typeof _config.data[key] === 'object') {
        const item = _config.data[key]
        if (item instanceof FileList || item instanceof File || item instanceof Blob) {
          hasFile = true
        }
      }
    })

    // 检测到存在文件使用 FormData 提交数据
    if (hasFile) {
      const formData = new FormData()
      Object.keys(_config.data).forEach(key => {
        formData.append(key, _config.data[key])
      })
      _config.data = formData
    }
  }
}

export default FaultTolerance
