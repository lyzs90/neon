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
  }
}

export default actions
