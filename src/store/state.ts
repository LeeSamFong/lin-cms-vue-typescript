export interface State {
  user: { [k in string]: unknown } | null;
  loggedIn: boolean; // 是否登录
}

const state: State = {
  user: {}, // 当前用户
  loggedIn: false,
}

export default state
