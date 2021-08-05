import { reactive, readonly } from 'vue'
import { PageSize } from '@/config'
import linAxios from '@/lin/plugin/axios'
import { UnifyPageResponse } from '@/lin/models/data_type/response-types'
import axios from 'axios'

const { CancelToken } = axios


interface Data<T> extends UnifyPageResponse<T> {
  loading: boolean;
  moreData: boolean;
  getMoreData: () => Promise<UnifyPageResponse<T> | undefined>;
  reset: (options?: {
    page?: number;
    count?: number;
    total?: number;
    params?: Params,
  }) => void;
  cancel: () => void;
}

interface Params {
  [k: string]: unknown;
}


function hasMoreData(page: number, count: number, total: number) {
  // 因为page是从0开始，所以要+1
  return total > ((page + 1) * count)
}


function usePaging<T>(url: string, params?: Params, options?: {
  page?: number;
  count?: number;
}) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let cancel: () => void = () => {
  }

  let _params = params

  const data = reactive<Data<T>>({
    page: options?.page ?? -1,
    count: options?.count ?? PageSize,
    items: [],
    total: 0,
    loading: false,
    moreData: true,
    getMoreData,
    reset,
    cancel,
  })

  function getParams(): ({
    [k in string]: unknown;
  }) {
    return {
      ..._params,
      page: data.page + 1,
      count: data.count,
    }
  }

  async function getMoreData() {
    const { moreData, loading } = data
    if (!moreData || loading) return

    data.loading = true

    const source = CancelToken.source()
    cancel = () => {
      data.loading = false
      source.cancel()
    }

    const res = await linAxios<UnifyPageResponse<T>>({
      url,
      params: getParams(),
      cancelToken: source.token,
    }).catch(e => {
      data.loading = false
      console.error(e)
      return Promise.reject(e)
    })

    const { page, count, total, items } = res

    data.moreData = hasMoreData(page, count, total)
    data.loading = false
    data.page = page
    data.count = count
    data.total = total

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    data.items.push(...items)

    return res
  }

  function reset(...[options]: Parameters<(Data<T>)['reset']>) {
    // 先取消请求
    cancel()

    data.page = options?.page ?? -1
    data.count = options?.count ?? PageSize
    data.total = options?.total ?? 0
    data.items = []
    data.loading = false
    data.moreData = true
    _params = options?.params ?? params
  }

  return readonly(data)
}

export default usePaging
