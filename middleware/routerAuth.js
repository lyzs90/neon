import { auth } from '~/services/firebaseService'

/**
 * Note: Middleware is executed on the client & server. But server store is
 * separate from client store.
 */
export default function ({ store, redirect, route, app }) {
  // Split between public and protected routes
  switch (route.name) {
    // Public routes
    case 'index':
      break
    case 'faq':
      break

    // Undefined route
    // case null:
    //  return redirect('/')

    // Protected routes
    default:
      return app.$axios.$get('/validateAuthSession')
        .then(hasSession => {
          if (hasSession) {
            return null
          }

          if (process.browser) {
            // Check if token is unexpired. We can use it to relog user
            const userKey = Object.keys(window.localStorage)
              .filter(item => item.startsWith('firebase:authUser'))[0]
            const user = userKey ? JSON.parse(localStorage.getItem(userKey)) : undefined
            const expired = Date.now() > user.stsTokenManager.expirationTime

            if (user && !expired) {
              store.commit('SET_USER', user)
              return app.$axios.$post('/persistUserSession', { user })
            }
          }

          store.commit('SET_USER', {})
          store.commit('SHOW_SNACKBAR', {
            color: 'error',
            message: 'You must log in to access this page!'
          })
          return auth.signOut()
            .then(() => {
              return redirect('/')
            })
        })
  }
}
