import { reactive, readonly, watch } from 'vue'
import axios from 'axios'
import { PageSize } from '@/config'
import linAxios from '@/lin/plugin/axios'
import { UnifyPageResponse } from '@/lin/models/data_type/response-types'

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


interface ReactiveData<T> extends UnifyPageResponse<T> {
  error: Error | null;
  loading: boolean;
  getData: (params?: Params) => Promise<UnifyPageResponse<T> | undefined>;
  reset: (options?: {
    page?: number;
    count?: number;
    total?: number;
    params?: Params,
  }) => void;
  cancel: () => void;
}

export function usePagination<T>(url: string, params?: Params, options?: {
  page?: number;
  count?: number;

  // 是否监听page参数的变化，自动获取下一页的数据
  // 必须是boolean，如果没有传入（不为boolean）时，内部自动处理成true
  watchPage?: boolean;
  // 同上，不过是对应count参数
  watchCount?: boolean;
}) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let cancel = () => {
  }

  const react = reactive<ReactiveData<T>>({
    page: options?.page ?? 1,
    count: options?.count ?? PageSize,
    items: [],
    total: 0,
    loading: false,
    error: null,
    getData,
    reset,
    cancel,
  })

  // region 设置参数监听

  // 开启监听page变化
  // 如果options没有传入watchPage参数，则默认为true
  function cancelAndGetData() {
    cancel()
    getData()
  }

  const watchPage = typeof options?.watchPage === 'boolean' ? options.watchPage : true
  if (watchPage) {
    watch(() => react.page, () => {
      cancelAndGetData()
    })
  }

  const watchCount = typeof options?.watchCount === 'boolean' ? options.watchCount : true
  if (watchCount) {
    watch(() => react.count, () => {
      cancelAndGetData()
    })
  }

  // endregion

  let _params = params

  function getParams(): ({
    [k in string]: unknown;
  }) {
    return {
      ..._params,
      page: react.page - 1,
      count: react.count,
    }
  }

  async function getData(params?: Params) {
    const { loading } = react
    if (loading) {
      throw new Error('loading')
    }

    if (params) {
      _params = params
    }

    react.loading = true

    const source = CancelToken.source()
    cancel = () => {
      react.loading = false
      source.cancel()
    }

    const res = await linAxios<UnifyPageResponse<T>>({
      url,
      params: getParams(),
      cancelToken: source.token,
    }).catch(e => {
      if (axios.isCancel(e)) {
        return Promise.reject(e)
      }

      react.loading = false
      react.error = e
      console.error(e)
      return Promise.reject(e)
    })

    const { total, items } = res
    react.loading = false
    react.total = total

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    react.items = items

    return res
  }

  function reset(...[options]: Parameters<(Data<T>)['reset']>) {
    // 先取消请求
    cancel()

    react.page = options?.page ?? 1
    react.count = options?.count ?? PageSize
    react.total = options?.total ?? 0
    react.items = []
    react.loading = false
    react.error = null
    _params = options?.params ?? params
  }

  return react
}


export default usePaging
