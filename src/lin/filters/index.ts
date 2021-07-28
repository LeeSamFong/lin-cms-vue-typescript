/*
 * 全局的过滤函数
 * */
import Utils from '@/lin/utils/utils'

export function checkAddZone(num: number) {
  return num < 10 ? `0${num.toString()}` : num
}

export const filters = {
  filterAddress(value?: {
    provinceName: string;
    cityName: string;
    countyName: string;
    detailInfo: string;
  }) {
    // 过滤地址
    if (!value) return value
    const obj = value
    return `${obj.provinceName}${obj.cityName}${obj.countyName} ${obj.detailInfo}`
  },

  filterTime(value?: number) {
    // 过滤时间戳，返回值yyyy-mm-dd
    if (!value) {
      return ''
    }
    const date = new Date(value * 1000)
    const y = date.getFullYear()
    const m = `0${date.getMonth() + 1}`
    const d = `0${date.getDate()}`
    return `${y}-${m.substring(m.length - 2, m.length)}-${d.substring(d.length - 2, d.length)}`
  },

  filterTimeYmdHms(value?: number) {
    // 过滤时间戳，返回值yyyy-mm-dd ss
    if (!value) {
      return ''
    }
    const yy_mm_dd = filters.filterTime(value)
    const date = new Date(value * 1000)
    const hh = date.getHours()
    const mm = `${date.getMinutes()}`
    const ss = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
    return `${yy_mm_dd}  ${hh}:${mm}:${ss}`
  },

  filterTimeYear(value?: number) {
    // 过滤时间戳, 返回值 今年:mm-dd 往年:yyyy-mm-dd
    if (!value) return ''

    const jy = new Date().getFullYear()
    const date = new Date(value * 1000)
    const y = date.getFullYear()
    const m = `0${date.getMonth() + 1}`
    const d = `0${date.getDate()}`
    const val = `${y}-${m.substring(m.length - 2, m.length)}-${d.substring(d.length - 2, d.length)}`
    const thisYear = `${m.substring(m.length - 2, m.length)}-${d.substring(d.length - 2, d.length)}`
    if (jy === y) {
      return thisYear
    }
    return val
  },

  dateFormatter(nows?: Date | number) {
    if (!nows) return ''
    const now = new Date(nows)
    const year = now.getFullYear()

    let month: string | number = now.getMonth() + 1
    month = checkAddZone(month)

    let date: string | number = now.getDate()
    date = checkAddZone(date)
    return `${year}-${month}-${date}`
  },

  dateTimeFormatter(_t?: number | Date) {
    if (!_t) return ''

    const t = new Date(_t)

    const year = t.getFullYear()
    let month: string | number = t.getMonth() + 1
    month = checkAddZone(month)

    let date: string | number = t.getDate()
    date = checkAddZone(date)

    let hour: string | number = t.getHours()
    hour = checkAddZone(hour)

    let min: string | number = t.getMinutes()
    min = checkAddZone(min)

    let se: string | number = t.getSeconds()
    se = checkAddZone(se)

    return `${year}-${month}-${date} ${hour}:${min}:${se}`
  },

  filterTitle(value: string, len = 9) {
    return Utils.cutString(value, len)
  },
}
