import { cloneDeep, debounce, throttle } from 'lodash'
import { SimpleLinRouteType } from '@/router/route-type'
import { UserType } from '@/lin/models/data_type/user'

class Utils {
  static cutString(str: string, length: number) {
    if (str.length * 2 <= length) return str

    let strLength = 0
    let s = ''
    for (let i = 0; i < str.length; i++) {
      s += str.charAt(i)
      if (str.charCodeAt(i) > 128) {
        strLength += 2
        if (strLength >= length) {
          return `${s.substring(0, s.length - 1)}...`
        }
      } else {
        strLength += 1
        if (strLength >= length) {
          return `${s.substring(0, s.length - 2)}...`
        }
      }
    }
    return s
  }

  static debounce = (...[func, wait = 50]: Parameters<typeof debounce>) => debounce(func, wait)

  static throttle = (...[func, wait = 50]: Parameters<typeof throttle>) => throttle(func, wait)

  static getRandomStr(n = 6) {
    let str = ''
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
    for (let i = 0; i < n; i += 1) {
      str += chars.charAt(Math.floor(Math.random() * 62))
    }
    return str
  }

  private static groupByOrder<T extends { order?: number }>(source: T[]) {
    type RequiredOrderItem = T & Required<Pick<T, 'order'>>

    // 有order的放这里
    const map: { [k in number]: RequiredOrderItem[] } = {}
    // 没有order放这里
    const noOrderList: T[] = []

    source.forEach(s => {
      const { order } = s
      if (typeof order !== 'number') {
        noOrderList.push(s)
        return
      }

      const list = map[order]
      if (list) {
        list.push(s as RequiredOrderItem)
      } else {
        map[order] = [s as RequiredOrderItem]
      }
    })

    return {
      orderMap: map,
      noOrderList,
    }
  }

  static sortByOrder<T extends { order?: number }>(source: T[]): T[] {
    if (!source.length) {
      return source
    }

    // 1.根据order对数据进行分组
    const { orderMap, noOrderList } = this.groupByOrder(source)

    // 2.获取已存在的order
    const orders = Object.keys(orderMap).map(o => Number(o))

    // 对order进行排序
    orders.sort((a, b) => (a - b))

    // 获取小于0的order
    const ltZeroOrders = orders.filter(o => o < 0)

    // 大于等于0的order
    const gteZeroOrders = orders.filter(o => o >= 0)

    const finallyArr: T[] = []
    const gteZeroItemList = gteZeroOrders.map(o => orderMap[o]).flat()

    finallyArr.push(...gteZeroItemList)
    finallyArr.push(...noOrderList)

    // 如果没有小于0的order，则直接拼接
    if (!ltZeroOrders.length) {
      return finallyArr
    }

    // 将小于0的order的item插入到数组中
    ltZeroOrders.reverse().forEach(o => {
      let index = finallyArr.length + o + 1
      if (index < 0) {
        index = 0
      }
      const arr = orderMap[o]
      finallyArr.splice(index, 0, ...arr)
    })

    return finallyArr
  }

  /**
   * 深度遍历，深拷贝
   */
  static deepClone = <T>(value: T) => cloneDeep(value)

  /**
   * 判断权限
   */
  static hasPermission(permissions: string[], route: SimpleLinRouteType, user: UserType | null) {
    if (user?.admin) {
      return true
    }

    if (route.permission) {
      return permissions.some(permission => route.permission?.includes(permission))
    }

    return true
  }
}

export default Utils
