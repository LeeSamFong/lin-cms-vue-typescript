type TypeHandler = (el: HTMLElement) => void

const disabledHandler: TypeHandler = el => {
  el.style.opacity = '0.4'
  el.style.cursor = 'not-allowed'
}

const hiddenHandler: TypeHandler = el => {
  el.style.display = 'none'
}

const handlers: {
  hidden: TypeHandler;
  [k: string]: TypeHandler;
} = {
  disabled: disabledHandler,
  hidden: hiddenHandler,
}

export default function typeHandle(type: string, el: HTMLElement) {
  const handler = handlers[type]
  if (!handler) {
    throw new Error(`当前没有该type：${type}`)
  }

  handler(el)
}
