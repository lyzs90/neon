import { isEmpty } from 'lodash'

const getters = {
  authenticated: state => {
    return !isEmpty(state.user)
  },

  userInitials: state => {
    if (state.user && state.user.email) {
      return state.user.email.substring(0, 1)
    }
    return 'T'
  }
}

export default getters
