/**
 * Note: Middleware is executed on the client & server. But server store is
 * separate from client store.
 */
export default function ({ store, redirect, route }) {
  switch (store.getters.authenticated) {
    // If authenticated
    case true:
      break

    // If not authenticated, split between public and protected routes
    default:
      switch (route.name) {
        // Public routes
        case 'index':
          break
        case 'faq':
          break

        // Protected routes
        default:
          store.commit('SHOW_SNACKBAR', {
            color: 'error',
            message: 'You must log in to access this page!'
          })
          return redirect('/')
      }
  }
}
