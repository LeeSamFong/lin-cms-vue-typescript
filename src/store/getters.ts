import { GetterTree } from 'vuex'
import { State } from '@/store/state'
import Utils from '@/lin/utils/utils'
import { LinRouteType } from '@/router/route-type'
import { UserType } from '@/lin/models/data_type/user'

export interface SideRoute {
  name: symbol;
  title: string;
  icon?: string;
  path: string;
  children?: SideRoute[];
}

let stageMap: {
  [k in string]: LinRouteType;
} = {}

/**
 * 在侧边栏展示时，如果当前路由 children 属性为空，则删除该路由
 */
function IterationDeleteMenuChildren(arr: LinRouteType[]) {
  if (!arr.length) {
    return arr
  }

  for (const i in arr) {
    const { children } = arr[i]
    if (!children?.length) {
      delete arr[i]
    } else if (children?.length) {
      IterationDeleteMenuChildren(children)
    }
  }
  return arr
}

function permissionShaking(stageConfig: LinRouteType[], permissions: State['permissions'], currentUser: UserType | null) {
  const shookConfig = stageConfig.filter(route => {
    if (!Utils.hasPermission(permissions, route, currentUser)) {
      return false
    }

    if (route.children?.length) {
      route.children = permissionShaking(route.children, permissions, currentUser)
    }
    return true
  })

  return IterationDeleteMenuChildren(shookConfig)
}

function deepTravel(source: LinRouteType[], func: (route: LinRouteType) => void) {
  source.forEach(item => {
    if (item.children?.length) {
      func(item)
      deepTravel(item.children, func)
      return
    }
    if (item.name) {
      func(item)
    }
  })
}

const getters: GetterTree<State, State> = {
  user: state => state.user,

  permissionStageConfig: state => {
    const { stageConfig, permissions, user } = state
    const tempStageConfig = Utils.deepClone(stageConfig)
    const shookConfig = permissionShaking(tempStageConfig, permissions, user)

    // 设置舞台缓存
    const map: typeof stageMap = {}
    deepTravel(shookConfig, item => {
      map[item.name as never] = item
    })
    stageMap = map
    return shookConfig
  },

  sidebarList: (state, getters) => {
    const { sidebarLevel } = state
    const permissionStageConfig = getters.permissionStageConfig as LinRouteType[]

    function deepGetSidebar(routes: LinRouteType[], level = 3): SideRoute[] {
      const acc = routes.map<SideRoute | null>(item => {
        // 检测是否需要在导航中显示
        if (!item.inNav) {
          return null
        }

        if (item.type === 'folder' && level !== 0) {
          return {
            name: item.name,
            title: item.title,
            icon: item.icon,
            path: item.route || Utils.getRandomStr(6),
            children: item.children ? deepGetSidebar(item.children, level - 1) : undefined,
          }
        }

        const sideRoute: SideRoute = {
          name: item.name,
          title: item.title,
          icon: item.icon,
          path: item.route,
        }

        // 处理一级就是 view 的情况
        if (item.type === 'view') {
          return sideRoute
        }

        function getDefaultRoute() {
          if (item.children?.length && item.children[0].route) {
            return item.children[0].route
          }
          return null
        }

        if (item.type === 'tab') {
          sideRoute.path = item.route
          // 如果 Tab 没有设置默认打开的路由, 则设置为第一个子节点路由
          if (!sideRoute.path) {
            sideRoute.path = getDefaultRoute() || ''
          }
          return sideRoute
        }

        // 最后一层, 都当做子节点处理
        if (level <= 0) {
          sideRoute.path = getDefaultRoute() || Utils.getRandomStr(6)
          return sideRoute
        }

        return null
      })

      return acc.filter(item => item !== null) as SideRoute[]
    }

    return deepGetSidebar(permissionStageConfig, sidebarLevel)
  },
}

export default getters
