const request = require('request-promise')
const Promise = require('bluebird')
const winston = require('winston').cli() // enable colors
const _ = require('lodash')

module.exports = {
  /**
   * @api {GET} /api/validateAuthSession
   */
  validateAuthSession: (req, res) => {
    const tag = `${req.uid} AuthController.validateAuthSession:`

    if (req.session.user) {
      winston.info(tag, `Session valid`)

      return res.send(true)
    }

    winston.info(tag, `Session invalid`)

    return res.send(false)
  },

  /**
   * @api {POST} /api/persistUserSession
   *
   * @apiParam (body)  {Object}  user  Firebase user object
   */
  persistUserSession: (req, res) => {
    const tag = `${req.uid} AuthController.persistUserSession:`
    const { user } = req.body

    if (user) {
      req.session.user = user
      winston.info(tag, `User session persisted`)

      return res.json({ message: 'User session persisted' })
    }

    winston.error(tag, `Server Error`)
    return res.status(500).json({ message: 'Server Error' })
  },

  /**
   * @api {GET} /api/endUserSession
   */
  endUserSession: (req, res) => {
    const tag = `${req.uid} AuthController.endUserSession:`

    if (req.session) {
      req.session.destroy()
      winston.info(tag, `User session ended`)

      return res.json({ message: 'User session ended' })
    }

    winston.error(tag, `Server Error`)
    return res.status(500).json({ message: 'Server Error' })
  },

  /**
   * @api {GET} /api/oauth/callback
   * @apiDescription Obtain user access_token once authorization from Stripe has
   * been granted
   *
   * @apiParam (query)  {String}  code  Stripe authorization code
   */
  stripeOauthCallback: (req, res) => {
    const tag = `${req.uid} AuthController.stripeOauthCallback:`
    const code = process.env.NODE_ENV === 'production' ? req.query.code : process.env.DEV_STRIPE_AUTH_CODE
    // State is userID:uuid. FIXME: how to use state to prevent CSRF?
    const state = req.query.state
    const userID = state.split(':')[0]
    let parsedBody

    return request.post('https://connect.stripe.com/oauth/token', {
      form: {
        code,
        grant_type: 'authorization_code',
        client_id: process.env.STRIPE_CLIENT_ID,
        client_secret: process.env.STRIPE_SECRET
      }
    })
      .then(body => {
        parsedBody = JSON.parse(body)
        parsedBody.user_id = userID

        return firestore.collection('accounts').where('user_id', '==', userID).get()
      })
      .then(snapshot => {
        if (_.isEmpty(snapshot.docs)) {
          return firestore.collection('accounts').doc().set(parsedBody)
        }

        // Overwrite the existing document
        const docID = snapshot.docs[0].id

        return firestore.collection('accounts').doc(docID).set(parsedBody)
      })
      .then(() => {
        winston.info(tag, `Oauth info saved to db`)
        return res.redirect(process.env.BASE_URL)
      })
  },

  /**
   * @api {GET} /api/account
   * @apiDescription Get user's oauth credentials from db
   *
   * @apiParam (query)  {String}  user  User ID
   */
  getStripeAccount: (req, res) => {
    const tag = `${req.uid} AuthController.getStripeAccount:`
    const userID = req.query.user

    return Promise.try(() => {
      return userID ? firestore.collection('accounts').where('user_id', '==', userID).get() : null
    })
      .then(snapshot => {
        if (_.isNull(snapshot) && _.isEmpty(snapshot.docs)) {
          throw new Error('AccountNotFound')
        }

        const result = []
        snapshot.forEach(doc => {
          result.push(doc.data())
        })
        return result
      })
      .then(({ stripe_user_id: accountID, access_token: accessToken }) => {
        // Makes request on behalf of connected account
        const stripe = require('stripe')(process.env.STRIPE_SECRET)
        return stripe.accounts.retrieve(accountID)

        /* Makes request as the connected account
        var stripe = require('stripe')(accessToken);
        return stripe.accounts.retrieve(accountID)
        */
      })
      .then(account => {
        return res.send(account)
      })
      .catch({ message: 'AccountNotFound' }, err => {
        winston.error(tag, err)
      })
  }
}
