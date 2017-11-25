import { auth } from '~/services/firebaseService'

export default function ({ store }) {
  return new Promise(resolve => {
    auth.onAuthStateChanged(user => {
      store.commit('SET_USER', user)
      resolve()
    })
  })
}
