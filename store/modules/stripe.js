
import qs from 'qs'
import uuidv4 from 'uuid/v4'

const state = {
  account: {}
}

const getters = {
  stripeID: state => {
    return state.id
  }
}

const mutations = {
  SET_STRIPE_ACCOUNT (state, payload) {
    state.account = payload
  }
}

const actions = {
  authorizeStripe ({ commit, getters }) {
    const userID = getters.userID
    const reqID = uuidv4()
    const AUTHORIZE_URI = 'https://connect.stripe.com/oauth/authorize'

    commit('TOGGLE_MAIN_SPINNER')

    window.location = AUTHORIZE_URI + '?' + qs.stringify({
      response_type: 'code',
      scope: 'read_write',
      client_id: process.env.STRIPE_CLIENT_ID,
      state: `${userID}:${reqID}`,
      redirect_uri: `${process.env.baseUrl}/api/oauth/callback`
    })
  },

  deauthorizeStripe ({ commit, getters }) {
    const stripeID = getters.stripeID
    commit('TOGGLE_BUTTON_SPINNER')

    return this.$axios.$post('/oauth/deauthorize', { stripe_user_id: stripeID })
      .then(() => {
        commit('SET_STRIPE_ACCOUNT', {})
        commit('SHOW_SNACKBAR', {
          color: 'success',
          message: 'Disconnected from Stripe'
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
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
