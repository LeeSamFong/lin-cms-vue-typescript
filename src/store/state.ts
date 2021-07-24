import { UserType } from '@/lin/models/data_type/user'

export interface State {
  user: UserType | null;
  loggedIn: boolean; // 是否登录

  permissions: string[],
}

const state: State = {
  user: null, // 当前用户
  loggedIn: false,
  permissions: [],
}

export default state
