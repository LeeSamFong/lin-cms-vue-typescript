import { UserInfoType, UserType } from '@/lin/models/data_type/user'
import Config from '@/config'
import stageRoutes from '@/config/stage'
import { LinRouteType } from '@/router/route-type'

export interface State {
  user: UserType | null;
  userInfo: UserInfoType | null;
  loggedIn: boolean; // 是否登录

  // 每个用户的所有权限
  permissions: string[];

  // 舞台配置
  stageConfig: LinRouteType[];

  sidebarLevel: number;
  defaultRoute: string;
}

const state: State = {
  user: null, // 当前用户
  userInfo: null, // 当前用户的信息
  loggedIn: false,
  permissions: [],

  stageConfig: stageRoutes,
  sidebarLevel: Config.sidebarLevel || 3,
  defaultRoute: Config.defaultRoute || '/about',
}

export default state
