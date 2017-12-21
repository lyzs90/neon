import { auth } from '~/services/firebaseService'

const actions = {
  /**
   * nuxtServerInit is called by Nuxt.js before server-rendering every page
   */
  nuxtServerInit ({ commit }, { req }) {
    if (req.session && req.session.user) {
      commit('SET_USER', req.session.user)
    }
  },

  createUserWithEmailAndPassword ({ commit }, { email, password }) {
    return auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        const userKey = Object.keys(window.localStorage)
          .filter(item => item.startsWith('firebase:authUser'))[0]
        const user = userKey ? JSON.parse(localStorage.getItem(userKey)) : undefined

        if (user) {
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
          // Make request to internal server to save user session. So it can be retrieved during SSR
          return this.$axios.$post('/persistUserSession', { user })
        }
      })
  }
}

export default actions
