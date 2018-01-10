import { auth } from '~/services/firebaseService'
import { isEmpty } from 'lodash'
import blockies from 'ethereum-blockies'
import uuidv4 from 'uuid/v4'
import Promise from 'bluebird'

const state = {
  account: {}
}

const getters = {
  authenticated: state => {
    return !isEmpty(state.account)
  },

  userInitials: state => {
    if (state.account && state.account.email) {
      return state.account.email.substring(0, 1)
    }
    return 'Ne'
  },

  userID: state => {
    return state.account.uid
  },

  userImage: state => {
    return state.account.photoURL
  }
}

const mutations = {
  SET_USER (state, payload) {
    state.account = payload
  }
}

const actions = {
  createUserWithEmailAndPassword ({ commit }, { email, password }) {
    return auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        const user = auth.currentUser
        const canvas = blockies.create({
          seed: user.uid,
          size: 15,
          scale: 20
        })
        const image = canvas.toDataURL('image/png')
        const imageID = uuidv4().replace(/-/g, '')

        return Promise.all([
          this.$axios.$post('/user', {
            uid: user.uid,
            photoUrl: imageID,
            email: user.email,
            phoneNumber: user.phoneNumber
          }),
          this.$axios.$post('/image', {
            image,
            id: imageID,
            folder: 'blockies'
          }),
          user.updateProfile({ photoURL: imageID })
        ])
      })
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
        this.app.router.push('/')

        return this.$axios.$get('/endUserSession')
      })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
