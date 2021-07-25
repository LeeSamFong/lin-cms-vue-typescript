import { LinRouteRecordRaw, LinRouteType } from '@/router/route-type'
import stageRoutes from '@/config/stage'

function deepTravel(configs: LinRouteType[], func: (config: LinRouteType) => void) {
  configs.forEach(config => {
    if (config.children?.length) {
      deepTravel(config.children, func)
      return
    }
    func(config)
  })
}

const homeRouter: LinRouteRecordRaw[] = []

/**
 * 构造舞台view路由
 */
deepTravel(stageRoutes, viewConfig => {
  const viewRouter: LinRouteRecordRaw = {
    path: viewConfig.route,
    name: viewConfig.name,
    component: () => import(`@/${viewConfig.filePath}`),
    meta: {
      title: viewConfig.title,
      icon: viewConfig.icon,
      permission: viewConfig.permission,
      type: viewConfig.type,
      blueBaseColor: viewConfig.blueBaseColor ? 'viewConfig.blueBaseColor' : '',
    },
  }

  homeRouter.push(viewRouter)
})

export default homeRouter
