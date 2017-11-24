import Vuex from 'vuex'

import mutations from './mutations'

const store = () => {
  return new Vuex.Store({
    state: {
      user: {}
    },

    mutations,

    getters: {
      authenticated: state => {
        return !!state.user
      }
    }
  })
}

export default store
