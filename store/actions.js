import { auth } from '~/services/firebaseService'
import qs from 'qs'
import uuidv4 from 'uuid/v4'

const actions = {
  /**
   * nuxtServerInit is called by Nuxt.js before server-rendering every page
   *
   * Page Refresh: User session info is stored on server in-memory. The cookie
   * is stored on the client and contains a uuid that points to the server
   * store. Future requests are made with that cookie in headers and server
   * retrieves session info and attaches to req.session.
   *
   * Server Restart: Session has been lost on the server. Hence, nuxtServerInit
   * will think user is logged out. But token may still be on localStorage,
   * which firebaseAuth plugin will pick up, leading to the hydration issue.
   *
   * FIXME: For now, if server cant find session, check token expiry and relog
   * user. In future, use a memory cache i.e. Redis or memcached. Then sessions
   * wont be lost if server goes down. May also want to consider getting
   * refresh tokens. Current token expiry is 1hr.
   */
  nuxtServerInit ({ commit, $axios }, { req }) {
    if (req.session && req.session.user) {
      return commit('SET_USER', req.session.user)
    }
  },

  createUserWithEmailAndPassword ({ commit }, { email, password }) {
    return auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        const userKey = Object.keys(window.localStorage)
          .filter(item => item.startsWith('firebase:authUser'))[0]
        const user = userKey ? JSON.parse(localStorage.getItem(userKey)) : undefined

        if (user) {
          commit('SET_USER', user)

          // Make request to internal server to save user session. So it can be retrieved during SSR
          return this.$axios.$post('/persistUserSession', { user })
        }
      })
      .catch(err => {
        switch (err.code) {
          case 'auth/email-already-in-use':
            throw new Error('DuplicateEmail')
          case 'auth/invalid-email':
            throw new Error('InvalidEmail')
          default:
            throw new Error('FirebaseAuthError')
        }
      })
  },

  signInWithEmail ({ commit }, { email, password }) {
    return auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        const userKey = Object.keys(window.localStorage)
          .filter(item => item.startsWith('firebase:authUser'))[0]
        const user = userKey ? JSON.parse(localStorage.getItem(userKey)) : undefined

        if (user) {
          commit('SET_USER', user)

          // Make request to internal server to save user session. So it can be retrieved during SSR
          return this.$axios.$post('/persistUserSession', { user })
        }
      })
  },

  signOut ({ commit }) {
    return auth.signOut()
      .then(() => {
        commit('SET_USER', {})

        return this.$axios.$get('/endUserSession')
      })
  },

  authorizeStripe ({ commit, getters }) {
    const userID = getters.userID
    const reqID = uuidv4()
    const AUTHORIZE_URI = 'https://connect.stripe.com/oauth/authorize'

    commit('TOGGLE_MAIN_SPINNER')

    window.location = AUTHORIZE_URI + '?' + qs.stringify({
      response_type: 'code',
      scope: 'read_write',
      client_id: process.env.STRIPE_CLIENT_ID,
      state: `${userID}:${reqID}`
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

export default actions
