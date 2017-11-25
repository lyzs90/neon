import firebase from 'firebase'

// Initialize Firebase
const config = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID
}

const fb = !firebase.apps.length ? firebase.initializeApp(config) : firebase.app()

export const auth = firebase.auth()
export default fb
