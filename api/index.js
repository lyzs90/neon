const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const admin = require('firebase-admin')

// Initialize Firebase Admin
// Note: firestore is only available on firebase-admin
const serviceAccount = require('../sa-key.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL
})
global.firestore = admin.firestore()

// Create express app
const app = express()
app.use(helmet())

// Create express router
const router = express.Router()

// Import Routes
const AuthController = require('./controllers/AuthController')

// Transform req & res to have the same API as express
// So we can use res.status() & res.json()
router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})

/**
 * Auth Routes
 */
const corsOptions = {
  origin: 'https://connect.stripe.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

router.get('/validateAuthSession', AuthController.validateAuthSession)
router.post('/persistUserSession', AuthController.persistUserSession)
router.get('/endUserSession', AuthController.endUserSession)
app.options('/oauth/callback', cors(corsOptions)) // Enable pre-flight request
router.get('/oauth/callback', cors(corsOptions), AuthController.stripeOauthCallback)
router.get('/account', AuthController.getStripeAccount)

// Export the server middleware
module.exports = {
  path: '/api',
  handler: router
}
