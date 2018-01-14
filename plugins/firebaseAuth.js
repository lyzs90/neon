import Promise from 'bluebird'
import { isNull } from 'lodash'

import { auth } from '~/services/firebaseService'

// Plugins run every time the page is refreshed
export default function ({ store, $axios }) {
  let userObj

  return new Promise((resolve, reject) => {
    /**
     * auth.onAuthStateChanged looks for token in localStorage. if it exists
     * and is unexpired, user is authenticated.
     *
     * Note that the full promise chain only runs on page refresh. But userObj
     * is set/cached every time auth is changed
     */
    auth.onAuthStateChanged(user => {
      userObj = user
      resolve()
    })
  })
    .then(() => {
      // Token does not exist. Treat user as unauthenticated
      if (!userObj) {
        store.commit('SET_USER', {})
        throw new Error('BreakError')
      }

      // Check if token is unexpired. We can use it to relog user
      const userKey = Object.keys(window.localStorage)
        .filter(item => item.startsWith('firebase:authUser'))[0]
      const user = userKey ? JSON.parse(localStorage.getItem(userKey)) : undefined
      const expired = user && Date.now() > user.stsTokenManager.expirationTime

      if (user && !expired) {
        store.commit('SET_USER', user)
        return Promise.all([
          $axios.$get(`/user/${user.uid}`),
          $axios.$post('/persistUserSession', { user })
        ])
      }

      return null
    })
    .then(results => {
      if (!isNull(results)) {
        const userDetails = results[0]
        store.commit('UPDATE_USER', userDetails)
        return null
      }

      // Token expired. Treat user as unauthenticated
      store.commit('SET_USER', {})
      return auth.signOut()
    })
    .catch({ message: 'BreakError' }, () => {})
    .catch(err => {
      console.log(err)
    })
}
