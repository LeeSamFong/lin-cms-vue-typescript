import { createRouter, createWebHashHistory } from 'vue-router'
import routes from '@/router/routes'
import Config from '@/config'
import store from '@/store'
import Utils from '@/lin/utils/utils'
import { SimpleLinRouteType } from '@/router/route-type'
import { ElMessage } from 'element-plus'
import autoJump from '@/lin/utils/auto-jump'


// 判断是否需要登录访问, 配置位于 config 文件夹
const isLoginRequired = (routeName: symbol | string | null | undefined) => {
  function includes(str: string) {
    return Config.notLoginRoute.includes(str)
  }

  if (!routeName) return true
  if (typeof routeName === 'string') {
    return !includes(routeName)
  }
  if (!routeName.description) {
    return true
  }
  return !includes(routeName.description)
}

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  // 登录验证
  if (isLoginRequired(to.name) && !store.state.loggedIn) {
    next({ path: '/login' })
    return
  }

  // tab 模式重复点击验证
  const meta = to.meta as SimpleLinRouteType
  if (meta.type === 'tab' && to.path === from.path) return

  // 权限验证
  const { user, permissions } = store.state
  if (to.path !== Config.defaultRoute && !Utils.hasPermission(permissions, to.meta as SimpleLinRouteType, user)) {
    ElMessage.error('您无此页面的权限哟~')
    next({ path: Config.defaultRoute })
    return
  }

  // 路由发生变化时重新计时
  autoJump()

  // 路由发生变化修改页面title
  if (typeof to.meta.title === 'string') {
    document.title = to.meta.title
  }

  next()
})

export default router
