import { MutationTree } from 'vuex'
import { State } from '@/store/state'
import { REMOVE_LOGGED_IN, SET_LOGGED_IN, SET_USER } from '@/store/mutation-type'

const mutations: MutationTree<State> = {
  [SET_LOGGED_IN](state) {
    state.loggedIn = true
  },

  [REMOVE_LOGGED_IN](state) {
    state.loggedIn = false
    state.user = null
  },

  [SET_USER](state, user: State['user']) {
    state.user = user
  },
}

export default mutations
