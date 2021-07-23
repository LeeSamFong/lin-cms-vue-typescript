const ErrorCode: {
  [k in string]: string;
} & {
  777: string;
  999: string;
} = {
  777: '前端错误码未定义',
  999: '服务器未知错误',
  10000: '未携带令牌',
  10020: '资源不存在',
  10030: '参数错误',
  10041: 'assessToken损坏',
  10042: 'refreshToken损坏',
  10051: 'assessToken过期',
  10052: 'refreshToken过期',
  10060: '字段重复',
  10070: '不可操作',
}

export const RefreshTokenCodes = [10000, 10042, 10050, 10052]
export const AccessTokenCodes = [10041, 10051]

export default ErrorCode
