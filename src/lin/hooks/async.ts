import { computed, readonly, ref } from 'vue'
// eslint-disable-next-line import/no-extraneous-dependencies
import { UnwrapRef } from '@vue/reactivity'
import axios from 'axios'


function useAsync<T, K extends unknown[]>(
  func: (...args: K) => Promise<T>,
) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const status = ref<'idle' | 'loading' | 'error' | 'cancel' | 'success'>('idle')
  const cancel = computed(() => status.value === 'cancel')
  const loading = computed(() => status.value === 'loading')


  async function run(...args: K) {
    if (loading.value) throw new Error('loading')

    status.value = 'loading'
    await func(...args)
      .then(res => {
        data.value = res as UnwrapRef<T>
        status.value = 'success'
        error.value = null
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

  return {
    run,
    clearError,
    data: readonly(data),
    status: readonly(status),
    error: readonly(error),
    loading,
    cancel,
  }
}


export default useAsync
