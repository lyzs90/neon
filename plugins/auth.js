import firebase from './firebase'

export default function ({ store, redirect }) {
  firebase.auth().onAuthStateChanged(user => {
    store.commit('SET_USER', user)
  })
}
