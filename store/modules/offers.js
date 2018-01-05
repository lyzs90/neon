import { extend, omit } from 'lodash'

const state = {
}

const getters = {
}

const mutations = {
}

const actions = {
  createOffer ({ commit, getters }, payload) {
    const userID = getters.userID
    const { offer_type: offerType } = payload

    commit('TOGGLE_BUTTON_SPINNER')
    extend(payload, { user_id: userID })
    omit(payload, 'offer_type')

    switch (offerType) {
      case 'Buy Ether':
        return this.$axios.$post('/buy', payload)
          .then(() => {
            commit('SHOW_SNACKBAR', {
              color: 'success',
              message: 'Your offer has been placed!'
            })
          })
          .catch(err => {
            // FIXME: somehow not receiving err.response obj. need to downgrade axios
            // @see https://github.com/nuxt-community/axios-module/issues/70
            console.log(err)
            commit('SHOW_SNACKBAR', {
              color: 'error',
              message: 'Server Error. Please try again later.'
            })
          })
          .finally(() => {
            commit('TOGGLE_BUTTON_SPINNER')
          })
      case 'Sell Ether':
        return this.$axios.$post('/sell', payload)
          .then(() => {
            commit('SHOW_SNACKBAR', {
              color: 'success',
              message: 'Your offer has been placed!'
            })
          })
          .catch(err => {
            console.log(err)
            commit('SHOW_SNACKBAR', {
              color: 'error',
              message: 'Server Error. Please try again later.'
            })
          })
          .finally(() => {
            commit('TOGGLE_BUTTON_SPINNER')
          })
      default:
        break
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
