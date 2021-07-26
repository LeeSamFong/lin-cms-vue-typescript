import { UserType } from '@/lin/models/data_type/user'
import Config from '@/config'
import stageRoutes from '@/config/stage'
import { LinRouteType } from '@/router/route-type'

export interface State {
  user: UserType | null;
  loggedIn: boolean; // 是否登录

  // 每个用户的所有权限
  permissions: string[];

  // 舞台配置
  stageConfig: LinRouteType[];

  sidebarLevel: number;
}

const state: State = {
  user: null, // 当前用户
  loggedIn: false,
  permissions: [],

  stageConfig: stageRoutes,
  sidebarLevel: Config.sidebarLevel || 3,
}

export default state
