import { auth } from '~/services/firebaseService'

const actions = {
  /**
   * This will prefill the server store for use in middleware
   */
  nuxtServerInit ({ commit }, { store }) {
    // Db should know if user is authenticated. Fetch user data and commit to server store. But how to know which user is making the request?
  },

  createUserWithEmailAndPassword ({ commit }, { email, password }) {
    return new Promise((resolve, reject) => {
      auth.createUserWithEmailAndPassword(email, password)
      resolve()
    })
  },

  signInWithEmail ({ commit }, { email, password }) {
    return new Promise((resolve, reject) => {
      auth.signInWithEmailAndPassword(email, password)
      resolve()
    })
  }
}

export default actions
