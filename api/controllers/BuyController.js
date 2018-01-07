const request = require('request-promise')
const Promise = require('bluebird')
const winston = require('winston').cli() // enable colors
const _ = require('lodash')

module.exports = {
  /**
   * @api {POST} /api/buy
   * @apiDescription Create an offer to buy Ether
   *
   * @apiParam (body)  {String}  user_id        ID of offeror
   * @apiParam (body)  {String}  [offeree_id]   ID of offeree
   * @apiParam (body)  {Number}  quantity       Quantity to purchase
   * @apiParam (body)  {Number}  unit_price     Price per unit
   * @apiParam (body)  {Number}  duration       Offer duration in minutes
   * @apiParam (body)  {Number}  total_price    Total price before fees
   *
   * @apiSuccess (201) - Offer created
   */
  create: (req, res) => {
    const tag = `${req.uid} BuyController.create:`

    _.extend(req.body, {
      status: 'pending'
    })

    return firestore.collection('buy_offers').doc().set(req.body)
      .then(() => {
        winston.info(tag, `Buy offer created`)
        return res.status(201).end()
      })
      .catch(err => {
        winston.error(tag, err)
        return res.status(500).json({ message: 'Server Error' })
      })
  },

  /**
   * @api {GET} /api/buy
   * @apiDescription Get all active buy offers
   *
   * @apiParam (query) {String}  user         ID of user to filter on
   *
   * @apiSuccess (200) {Object[]}   Array of buy offers created by the user
   */
  findAll: (req, res) => {
    const tag = `${req.uid} BuyController.findAll:`
    const userID = req.query.user

    return Promise.try(() => {
      return userID ? firestore.collection('buy_offers').where('user_id', '==', userID).get() : null
    })
      .then(snapshot => {
        if (snapshot.empty) {
          return []
        }

        const result = []
        snapshot.forEach(doc => {
          result.push(doc.data())
        })
        return result
      })
      .then(offers => {
        return res.send(offers)
      })
      .catch(err => {
        winston.error(tag, err)
        return res.status(500).json({ message: 'Server Error' })
      })
  },

  /**
   * @api {GET} /api/buy/:id
   * @apiDescription Get one buy offer
   *
   * @apiParam (param) {String}  id             ID of transaction
   */
  findOne: (req, res) => {
    const tag = `${req.uid} BuyController.findOne:`
    const { id } = req.params
  },

  /**
   * @api {PUT} /api/buy/:id/cancel
   * @apiDescription Cancel a buy offer
   *
   * @apiParam (param) {String}  id             ID of transaction
   */
  cancel: (req, res) => {
    const tag = `${req.uid} BuyController.cancel:`
    const { id } = req.params
  },
}
