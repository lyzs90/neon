const mutations = {
  SET_USER (state, payload) {
    state.user = payload
  },

  OPEN_NAV (state) {
    state.displayNav = true
  },

  CLOSE_NAV (state) {
    state.displayNav = false
  },

  SHOW_SNACKBAR (state) {
    state.displaySnackbar = true
  },

  CLOSE_SNACKBAR (state) {
    state.displaySnackbar = false
  }
}

export default mutations
