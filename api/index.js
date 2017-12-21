const express = require('express')

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

// Export the server middleware
module.exports = {
  path: '/api',
  handler: router
}
