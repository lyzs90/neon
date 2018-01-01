const request = require('request-promise')
const Promise = require('bluebird')
const winston = require('winston').cli() // enable colors
const _ = require('lodash')

module.exports = {
  /**
   * @api {GET} /api/oauth/callback
   * @apiDescription Obtain user access_token once authorization from Stripe has
   * been granted. This endpoint is used as the Stripe redirect_url.
   *
   * @apiParam (query)  {String}  code    Stripe authorization code
   * @apiParam (query)  {String}  state   CSRF token with format <userID:uuid>
   */
  stripeOauthCallback: (req, res) => {
    const tag = `${req.uid} StripeController.stripeOauthCallback:`
    const code = req.query.code
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
      .catch(err => {
        winston.error(tag, err)
        return res.status(500).json({ message: 'Server Error' })
      })
  },

  /**
   * @api {POST} /api/oauth/deauthorize
   * @apiDescription Revoke access to a user's Stripe account
   *
   * @apiParam (body)  {String}  stripe_user_id  Stripe account to disconnect
   */
  deauthorizeStripeAccount: (req, res) => {
    const tag = `${req.uid} StripeController.deauthorizeStripeAccount:`
    const stripeID = req.body.stripe_user_id

    /*
    return request.post('https://connect.stripe.com/oauth/deauthorize', {
      client_id: process.env.STRIPE_CLIENT_ID,
      stripe_user_id: stripeID
    })
     */
    return firestore.collection('accounts').where('stripe_user_id', '==', stripeID).get()
      .then(snapshot => {
        if (snapshot.empty) {
          return null
        }

        snapshot.forEach(doc => {
          doc.ref.delete()
        })
      })
      .then(() => {
        return res.end()
      })
      .catch(err => {
        winston.error(tag, err)
        return res.status(500).json({ message: 'Server Error' })
      })
  },

  /**
   * @api {GET} /api/account
   * @apiDescription Get user's oauth credentials from db
   *
   * @apiParam (query)  {String}  user  User ID
   */
  getStripeAccount: (req, res) => {
    const tag = `${req.uid} StripeController.getStripeAccount:`
    const userID = req.query.user

    return Promise.try(() => {
      return userID ? firestore.collection('accounts').where('user_id', '==', userID).get() : null
    })
      .then(snapshot => {
        if (snapshot.empty) {
          throw new Error('AccountNotFound')
        }

        const result = []
        snapshot.forEach(doc => {
          result.push(doc.data())
        })
        return result
      })
      .then(({ stripe_user_id: accountID, access_token: accessToken }) => {
        // Makes request on behalf of connected account. Extra check to prevent root account details from being retrieved
        if (_.isNil(accountID)) {
          const stripe = require('stripe')(process.env.STRIPE_SECRET)
          return stripe.accounts.retrieve(accountID)
        }

        /* Makes request as the connected account
        var stripe = require('stripe')(accessToken);
        return stripe.accounts.retrieve()
        */
      })
      .then(account => {
        return res.send(account)
      })
      .catch({ message: 'AccountNotFound' }, err => {
        winston.error(tag, err)
        return res.status(404).json({ message: 'Stripe account not found' })
      })
      .catch(err => {
        winston.error(tag, err)
        return res.status(500).json({ message: 'Server Error' })
      })
  }
}
