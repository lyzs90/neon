import { auth } from '~/services/firebaseService'

export default function ({ store }) {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(user => {
      store.commit('SET_USER', user)
      resolve()
    })
  })
}
