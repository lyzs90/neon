const mutations = {
  SET_USER (state, payload) {
    state.user = payload
  },

  SET_STRIPE_ACCOUNT (state, payload) {
    state.stripe = payload
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

  TOGGLE_MAIN_SPINNER (state) {
    state.mainSpinner.display = !state.mainSpinner.display
  },

  TOGGLE_SETTINGS_SPINNER (state) {
    state.settingsSpinner.display = !state.settingsSpinner.display
  }
}

export default mutations
