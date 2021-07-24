import { MutationTree } from 'vuex'
import { State } from '@/store/state'
import { UserType } from '@/lin/models/data_type/user'

const mutations: MutationTree<State> = {
  setLoggedIn(state) {
    state.loggedIn = true
  },

  removeLoggedIn(state) {
    state.loggedIn = false
    state.user = null
  },

  setUser(state, user: UserType) {
    state.user = user
  },

  setUserPermissions(state, permissions: UserType['permissions']) {
    state.permissions = permissions
      .map(permission => Object.values(permission))
      .flat(2)
      .map(p => p.permission)
  },
}

export default mutations
