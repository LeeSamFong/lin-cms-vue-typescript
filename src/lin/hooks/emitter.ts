import { EventType, Handler } from 'mitt'
import { onMounted, onUnmounted } from 'vue'
import emitter from '@/lin/utils/emitter'

type Events = Record<EventType, unknown>

export const useEmitterListener = <Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void => {
  onMounted(() => {
    emitter.on(type, handler)
  })

  onUnmounted(() => {
    emitter.off(type, handler)
  })
}

export const useEmit = <Key extends keyof Events>(type: Key, event: Events[Key]): void => {
  emitter.emit(type, event)
}
