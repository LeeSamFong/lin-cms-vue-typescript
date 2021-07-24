import { ActionTree } from 'vuex'
import { State } from '@/store/state'

const actions: ActionTree<State, State> = {
  setUserAndState({ commit }, user: State['user']) {
    commit('setUser', user)
    commit('setLoggedIn')
  },

  logout({ commit }) {
    localStorage.clear()
    commit('removeLoggedIn')
  },
}

export default actions
