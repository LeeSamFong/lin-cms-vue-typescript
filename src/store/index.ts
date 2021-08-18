import { createLogger, createStore, Store, useStore as baseUseStore } from 'vuex'
import { InjectionKey } from 'vue'
import VuexPersistence from 'vuex-persist'
import state, { State } from '@/store/state'
import mutations from '@/store/mutations'
import actions from '@/store/actions'
import getters from '@/store/getters'


const vuexLocal = new VuexPersistence<State>({
  storage: window.localStorage,
  reducer: stateData => ({
    user: stateData.user,
    userInfo: stateData.userInfo,
    loggedIn: stateData.loggedIn,
    permissions: stateData.permissions,
  }),
})

export const storeKey: InjectionKey<Store<State>> = Symbol()

const debug = process.env.NODE_ENV !== 'production'

const store = createStore<State>({
  state,
  mutations,
  actions,
  getters,
  modules: {},
  strict: debug,
  plugins: debug ? [vuexLocal.plugin, createLogger()] : [vuexLocal.plugin],
})

export function useStore() {
  return baseUseStore(storeKey)
}

export default store
