const getters = {
  authenticated: state => {
    return !!state.user
  }
}

export default getters
