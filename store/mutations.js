const mutations = {
  SET_USER (state, payload) {
    state.user = payload
  },

  SHOW_SNACKBAR (state) {
    state.displaySnackbar = true
  },

  CLOSE_SNACKBAR (state) {
    state.displaySnackbar = false
  }
}

export default mutations
