import { LogType } from '@/lin/models/data_type/log'

// eslint-disable-next-line import/prefer-default-export
export function searchLogKeyword(keyword: string, logs: LogType[], className = 'strong'): LogType[] {
  return logs.map(log => {
    let { message } = log
    message = message.replace(RegExp(`${keyword}`, 'g'), `<span class="${className}">${keyword}</span>`)

    return {
      ...log,
      message,
    }
  })
}
