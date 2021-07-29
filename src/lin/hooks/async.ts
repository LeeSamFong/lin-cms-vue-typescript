import { computed, ref, readonly } from 'vue'
// eslint-disable-next-line import/no-extraneous-dependencies
import { UnwrapRef } from '@vue/reactivity'


function useAsync<T, K extends unknown[]>(
  func: (...args: K) => Promise<T>,
  ...args: K
) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const status = ref<'idle' | 'loading' | 'error' | 'success'>('idle')
  const loading = computed(() => status.value === 'loading')

  function run() {
    status.value = 'loading'
    func(...args)
      .then(res => {
        data.value = res as UnwrapRef<T>
        status.value = 'success'
      })
      .catch(err => {
        error.value = err
        status.value = 'error'
      })
  }

  function clearError() {
    error.value = null
  }

  function runAndClearError() {
    clearError()
    run()
  }

  return {
    run,
    clearError,
    runAndClearError,
    data: readonly(data),
    loading: readonly(loading),
    status: readonly(status),
    error: readonly(error),
  }
}


export default useAsync
