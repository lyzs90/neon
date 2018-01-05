import Vuex from 'vuex'

import getters from './getters'
import actions from './actions'
import mutations from './mutations'

import user from './modules/user'
import stripe from './modules/stripe'
import offers from './modules/offers'

const store = () => {
  return new Vuex.Store({
    // Global Store
    state: {
      nav: {
        display: false,
        shrink: false
      },
      snackbar: {
        display: false,
        color: '',
        message: ''
      },
      mainSpinner: {
        display: false
      },
      settingsSpinner: {
        display: false
      },
      buttonSpinner: {
        display: false
      }
    },
    getters,
    actions,
    mutations,

    // Namespaced Stores
    // Note: Actions, mutations and getters inside modules are still registered under the global namespace. unless pass `namespaced : true` in their export obj
    modules: {
      user,
      stripe,
      offers
    }
  })
}

export default store
