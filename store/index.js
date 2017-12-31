import Vuex from 'vuex'

import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const store = () => {
  return new Vuex.Store({
    state: {
      user: {},
      nav: {
        display: false,
        shrink: false
      },
      snackbar: {
        display: false,
        color: '',
        message: ''
      },
      spinner: {
        display: false
      }
    },
    getters,
    actions,
    mutations
  })
}

export default store
