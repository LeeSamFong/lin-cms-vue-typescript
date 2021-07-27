import router from '@/router'
import Config from '@/config'

let timer: number | null = null

function autoJump() {
  if (timer) window.clearTimeout(timer)
  if (!Config.openAutoJumpOut) return
  const { path } = router.currentRoute.value
  if (path === '/' || path === '/login') {
    return
  }

  timer = window.setTimeout(() => {
    // TODO logout
    const { origin } = window.location
    window.location.href = origin
  }, Config.stagnateTime)
}

export default autoJump
