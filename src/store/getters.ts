import { GetterTree } from 'vuex'
import { State } from '@/store/state'

const getters: GetterTree<State, State> = {
  user: state => state.user,
}

export default getters
