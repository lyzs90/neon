import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'

// Initialize Firebase
const config = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
} else {
  firebase.app()
}

export const auth = firebase.auth()
export const db = firebase.firestore()
export default firebase
