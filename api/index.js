const express = require('express')
const axios = require('axios')

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
 * @api {POST} /api/validateAuthSession
 */
router.get('/validateAuthSession', (req, res) => {
  if (req.session.user) {
    return res.status(200).send(true)
  }
  return res.status(200).send(false)
})

/**
 * @api {POST} /api/persistUserSession
 *
 * @apiParam (body)  {Object}  user  Firebase user object
 */
router.post('/persistUserSession', (req, res) => {
  const { user } = req.body

  if (user) {
    req.session.user = user
    return res.status(200).json({ message: 'User session persisted' })
  }
  return res.status(500).json({ message: 'Server Error' })
})

/**
 * @api {GET} /api/endUserSession
 */
router.get('/endUserSession', (req, res) => {
  if (req.session) {
    req.session.destroy()
    return res.status(200).json({ message: 'User session ended' })
  }
  return res.status(500).json({ message: 'Server Error' })
})

/**
 * @api { GET } /api/oauthCallback
 *
 * @apiParam (query)  {String}  code  Stripe authorization code
 */
router.get('/oauthCallback', (req, res) => {
  const code = req.query.code

  // do something with req.query.state, for CSRF

  return axios.post('https://connect.stripe.com/oauth/token', {
    params: {
      client_secret: process.env.STRIPE_SECRET,
      code,
      grant_type: 'authorization_code'
    }
  })
    .then(account => {
      console.log(account)
    })
})

// Export the server middleware
module.exports = {
  path: '/api',
  handler: router
}
