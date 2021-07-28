import { onMounted, onUnmounted } from 'vue'

// eslint-disable-next-line import/prefer-default-export
export const useEventListener = <K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions): void => {
  onMounted(() => {
    window.addEventListener(type, listener, options)
  })

  onUnmounted(() => {
    window.removeEventListener(type, listener, options)
  })
}
