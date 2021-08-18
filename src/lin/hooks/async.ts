import { computed, readonly, ref } from 'vue'
import axios from 'axios'


function useAsync<T, K extends unknown[]>(
  func: (...args: K) => Promise<T>,
) {
  const data = ref<T | undefined>()
  const error = ref<Error | null>(null)
  const status = ref<'idle' | 'loading' | 'error' | 'cancel' | 'success'>('idle')
  const cancel = computed(() => status.value === 'cancel')
  const loading = computed(() => status.value === 'loading')


  async function run(...args: K) {
    if (loading.value) throw new Error('loading')

    status.value = 'loading'
    return func(...args)
      .then(res => {
        data.value = res
        status.value = 'success'
        error.value = null
        return res
      })
      .catch(err => {
        if (axios.isCancel(err)) {
          status.value = 'cancel'
          return Promise.reject(err)
        }
        error.value = err
        status.value = 'error'
        return Promise.reject(err)
      })
  }

  function clearError() {
    error.value = null
  }

  function reset() {
    data.value = undefined
    error.value = null
    status.value = 'idle'
  }

  return {
    run,
    clearError,
    reset,
    data: readonly(data),
    status: readonly(status),
    error: readonly(error),
    loading,
    cancel,
  }
}


export default useAsync
