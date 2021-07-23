import { createStore } from 'vuex'
import state, { State } from '@/store/state'
import mutations from '@/store/mutations'
import actions from '@/store/actions'

const store = createStore<State>({
  state,
  mutations,
  actions,
  modules: {},
})

export default store
