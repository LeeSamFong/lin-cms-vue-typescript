import router from '@/router'
import Config from '@/config'
import store from '@/store'

let timer: number | null = null

function autoJump() {
  if (timer) window.clearTimeout(timer)
  if (!Config.openAutoJumpOut) return
  const { path } = router.currentRoute.value
  if (path === '/' || path === '/login') {
    return
  }

  timer = window.setTimeout(() => {
    store.dispatch('logout')
    const { origin } = window.location
    window.location.href = origin
  }, Config.stagnateTime)
}

export default autoJump
