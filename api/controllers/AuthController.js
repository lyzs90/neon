const axios = require('axios')

module.exports = {
  /**
   * @api {GET} /api/validateAuthSession
   */
  validateAuthSession: (req, res) => {
    if (req.session.user) {
      return res.status(200).send(true)
    }
    return res.status(200).send(false)
  },

  /**
   * @api {POST} /api/persistUserSession
   *
   * @apiParam (body)  {Object}  user  Firebase user object
   */
  persistUserSession: (req, res) => {
    const { user } = req.body

    if (user) {
      req.session.user = user
      return res.status(200).json({ message: 'User session persisted' })
    }
    return res.status(500).json({ message: 'Server Error' })
  },

  /**
   * @api {GET} /api/endUserSession
   */
  endUserSession: (req, res) => {
    if (req.session) {
      req.session.destroy()
      return res.status(200).json({ message: 'User session ended' })
    }
    return res.status(500).json({ message: 'Server Error' })
  },

  /**
   * @api { GET } /api/stripeOauthCallback
   *
   * @apiParam (query)  {String}  code  Stripe authorization code
   */
  stripeOauthCallback: (req, res) => {
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
  }
}
