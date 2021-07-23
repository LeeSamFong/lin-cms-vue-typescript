import { ActionTree } from 'vuex'
import { State } from '@/store/state'
import { REMOVE_LOGGED_IN } from '@/store/mutation-type'

const actions: ActionTree<State, State> = {
  logout({ commit }) {
    localStorage.clear()
    commit(REMOVE_LOGGED_IN, false)
  },
}

export default actions
