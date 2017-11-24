import firebase from 'firebase'

export default function ({ redirect }) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      redirect('/')
    } else {
      redirect('/login')
    }
  })
}
