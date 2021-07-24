import { LinRouteType } from '@/router/route-type'

const stageRoutes: LinRouteType[] = [
  {
    title: '404',
    type: 'view',
    name: Symbol('404'),
    route: '/error-page',
    filePath: 'views/error-page/error-page.vue',
    inNav: false,
    icon: 'iconfont icon-rizhiguanli',
  },
]

export default stageRoutes
