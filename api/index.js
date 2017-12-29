const express = require('express')
const AuthController = require('./controllers/AuthController')

// Create express router
const router = express.Router()

// Transform req & res to have the same API as express
// So we can use res.status() & res.json()
var app = express()
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
router.get('/validateAuthSession', AuthController.validateAuthSession)
router.post('/persistUserSession', AuthController.persistUserSession)
router.get('/endUserSession', AuthController.endUserSession)
router.get('/stripeOauthCallback', AuthController.stripeOauthCallback)

// Export the server middleware
module.exports = {
  path: '/api',
  handler: router
}
