import { LinRouteType } from '@/router/route-type'
import Utils from '@/lin/utils/utils'

// eslint-disable-next-line import/no-mutable-exports
let stageRoutes: LinRouteType[] = [
  {
    title: '林间有风',
    type: 'view',
    name: Symbol('about'),
    route: '/about',
    filePath: 'views/about/about.vue',
    inNav: true,
    icon: 'iconfont icon-iconset0103',
    order: 1,
  },
  {
    title: '日志管理',
    type: 'view',
    name: Symbol('log'),
    route: '/log',
    filePath: 'views/log/log.vue',
    inNav: true,
    icon: 'iconfont icon-rizhiguanli',
    order: 2,
    permission: ['查询所有日志'],
  },
  {
    title: '404',
    type: 'view',
    name: Symbol('404'),
    route: '/error-page',
    filePath: 'views/error-page/404.vue',
    inNav: false,
    icon: 'iconfont icon-rizhiguanli',
  },
]

// 处理顺序
stageRoutes = Utils.sortByOrder(stageRoutes)

export default stageRoutes
