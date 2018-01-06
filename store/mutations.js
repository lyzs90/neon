import { omit } from 'lodash'

const mutations = {
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
  },

  TOGGLE_BUTTON_SPINNER (state) {
    state.buttonSpinner.display = !state.buttonSpinner.display
  },

  SET_LISTENER (state, { name, unsubscribe }) {
    state.listeners = {
      ...state.listeners,
      [name]: {
        unsubscribe
      }
    }
  },

  REMOVE_LISTENER (state, name) {
    state.listeners = omit(state.listeners, name)
  }
}

export default mutations
