import linAxios from '@/lin/plugin/axios'
import { UnifyPageResponse } from '@/lin/models/data_type/response-types'
import { PageSize } from '@/config'
import { LogType } from '@/lin/models/data_type/log'
import usePaging from '@/lin/hooks/paging'

class LogModel {
  /**
   * 查询已经被记录过日志的用户（分页）
   * @param page
   * @param count
   */
  static async getLoggedUsers({ page = 0, count = PageSize } = {}) {
    return linAxios<UnifyPageResponse<string>>({
      url: 'cms/log/users',
      params: {
        count,
        page,
      },
    })
  }

  /**
   * 查询日志信息（分页）
   * @param page
   * @param count
   * @param name
   * @param start
   * @param end
   */
  static async getLogs({
    page = 0,
    count = PageSize,
    name,
    start,
    end,
  }: {
    page?: number;
    count?: number;
    // 用户昵称
    name?: string;
    // 起始时间 # 2018-11-01 09:39:35
    start?: number;
    // 结束时间
    end?: number;
  } = {}) {
    return linAxios<UnifyPageResponse<LogType>>({
      url: 'cms/log',
      params: {
        page,
        count,
        name,
        start,
        end,
      },
    })
  }

  /**
   * 所搜日志信息（分页）
   * @param count
   * @param page
   * @param keyword
   * @param name
   * @param start
   * @param end
   */
  static async searchLogs({
    count = PageSize,
    page = 0,
    keyword,
    name,
    start,
    end,
  }: {
    count?: number;
    page?: number;
    keyword: string;
    name: string;
    start: string;
    end: string;
  }) {
    return linAxios<UnifyPageResponse<LogType>>({
      url: 'cms/log/search',
      params: {
        count,
        page,
        keyword,
        name,
        start,
        end,
      },
    })
  }

  /**
   * 查询已经被记录过日志的用户（分页）
   */
  static useLoggedUsersPaging() {
    return usePaging<string>('cms/log/users')
  }

  /**
   * 查询日志信息（分页）hook
   * @param name
   * @param start
   * @param end
   */
  static useGetLogsPaging({ name, start, end }: {
    // 用户昵称
    name?: string;
    // 起始时间 # 2018-11-01 09:39:35
    start?: number;
    // 结束时间
    end?: number;
  }) {
    return usePaging<LogType>('cms/log', {
      name,
      start,
      end,
    })
  }

  /**
   * 搜所日志信息（分页）
   * @param keyword
   * @param name
   * @param start
   * @param end
   */
  static useSearchLogsPaging({ keyword, name, start, end }: {
    keyword: string;
    name: string;
    start?: string;
    end?: string;
  }) {
    return usePaging<LogType>('cms/log/search', {
      keyword,
      name,
      start,
      end,
    })
  }
}

export default LogModel
