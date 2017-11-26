const getters = {
  authenticated: state => {
    return !!state.user
  },

  userInitials: state => {
    return (state.user && state.user.email.substring(0, 1)) || 'T'
  }
}

export default getters
