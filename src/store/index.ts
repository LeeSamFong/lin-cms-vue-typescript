import { createStore, Store, useStore as baseUseStore } from 'vuex'
import state, { State } from '@/store/state'
import mutations from '@/store/mutations'
import actions from '@/store/actions'
import { InjectionKey } from 'vue'
import getters from '@/store/getters'

export const storeKey: InjectionKey<Store<State>> = Symbol()

const store = createStore<State>({
  state,
  mutations,
  actions,
  getters,
  modules: {},
})

export function useStore() {
  return baseUseStore(storeKey)
}

export default store
