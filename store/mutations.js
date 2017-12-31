const mutations = {
  SET_USER (state, payload) {
    state.user = payload
  },

  OPEN_NAV (state) {
    state.nav.display = true
  },

  CLOSE_NAV (state) {
    state.nav.display = false
  },

  SHRINK_NAV (state) {
    state.nav.shrink = true
  },

  UNSHRINK_NAV (state) {
    state.nav.shrink = false
  },

  SHOW_SNACKBAR (state, payload) {
    const { color, message } = payload
    state.snackbar.display = true
    state.snackbar.color = color
    state.snackbar.message = message
  },

  CLOSE_SNACKBAR (state) {
    state.snackbar.display = false
  },

  TOGGLE_SPINNER (state) {
    state.spinner.display = !state.spinner.display
  }
}

export default mutations
