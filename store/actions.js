import { auth } from '~/services/firebaseService'

const actions = {
  /**
   * This will prefill the server store for use in middleware
   */
  nuxtServerInit ({ commit }, { store }) {
    // Db should know if user is authenticated. Fetch user data and commit to server store. But how to know which user is making the request?
  },

  createUserWithEmailAndPassword ({ commit }, { email, password }) {
    return auth.createUserWithEmailAndPassword(email, password)
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
  }
}

export default actions
