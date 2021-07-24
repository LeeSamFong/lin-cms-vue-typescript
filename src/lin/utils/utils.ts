import { throttle, debounce } from 'lodash'

class Utils {
  static debounce = (...[func, wait = 50]: Parameters<typeof debounce>) => debounce(func, wait)

  static throttle = (...[func, wait = 50]: Parameters<typeof throttle>) => throttle(func, wait)
}

export default Utils
