const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const admin = require('firebase-admin')

/**
 * Initialize Firebase Admin
 * Note: firestore is only available on firebase-admin
 */
const serviceAccount = require('../sa-key.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET
})
global.firestore = admin.firestore()
global.storage = admin.storage()

/**
 * Initialize Express
 */
const app = express()
app.use(helmet())

// Create express router
const router = express.Router()

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

// Authentication
const AuthController = require('./controllers/AuthController')
router.get('/validateAuthSession', AuthController.validateAuthSession)
router.post('/persistUserSession', AuthController.persistUserSession)
router.get('/endUserSession', AuthController.endUserSession)

// Stripe APIs
const StripeController = require('./controllers/StripeController')
const corsOptions = {
  origin: 'https://connect.stripe.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.options('/oauth/callback', cors(corsOptions)) // Enable pre-flight request
router.get('/oauth/callback', cors(corsOptions), StripeController.stripeOauthCallback)
router.post('/oauth/deauthorize', cors(corsOptions), StripeController.deauthorizeStripeAccount)
router.get('/account/:id', StripeController.getStripeAccount)

// Buy Offer
const BuyController = require('./controllers/BuyController')
router.post('/buy', BuyController.create)
router.get('/buy', BuyController.findAll)
router.get('/buy/:id', BuyController.findOne)
router.put('/buy/:id/cancel', BuyController.cancel)

// Images
const ImageController = require('./controllers/ImageController')
router.post('/image', ImageController.create)
router.get('/image/:id', ImageController.findOne)

// User
const UserController = require('./controllers/UserController')
router.post('/user', UserController.create)
router.get('/user/:id', UserController.findOne)

// Export the server middleware
module.exports = {
  path: '/api',
  handler: router
}
