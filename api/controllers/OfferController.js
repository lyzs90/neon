const request = require('request-promise')
const Promise = require('bluebird')
const winston = require('winston').cli() // enable colors
const _ = require('lodash')

module.exports = {
  /**
   * @api {POST} /api/offer
   * @apiDescription Create an offer
   *
   * @apiParam (body)  {String}  user_id        ID of offeror
   * @apiParam (body)  {String}  offer_type     Type of offer
   * @apiParam (body)  {String}  [offeree_id]   ID of offeree
   * @apiParam (body)  {Number}  quantity       Quantity to purchase
   * @apiParam (body)  {Number}  unit_price     Price per unit
   * @apiParam (body)  {Number}  duration       Offer duration in minutes
   * @apiParam (body)  {Number}  total_price    Total price before fees
   *
   * @apiSuccess (201) - Offer created
   */
  create: (req, res) => {
    const tag = `${req.uid} OfferController.create:`

    _.extend(req.body, {
      status: 'pending'
    })

    return firestore.collection('offers').doc().set(req.body)
      .then(() => {
        winston.info(tag, `Offer created`)
        return res.status(201).end()
      })
      .catch(err => {
        winston.error(tag, err)
        return res.status(500).json({ message: 'Server Error' })
      })
  },

  /**
   * @api {GET} /api/offer
   * @apiDescription Get all active offers
   *
   * @apiParam (query) {String}  user         ID of user to filter on
   *
   * @apiSuccess (200) {Object[]}   Array of offers created by the user
   */
  findAll: (req, res) => {
    const tag = `${req.uid} OfferController.findAll:`
    const userID = req.query.user

    return Promise.try(() => {
      return userID ? firestore.collection('offers').where('user_id', '==', userID).get() : null
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
   * @api {GET} /api/offer/:id
   * @apiDescription Get one offer
   *
   * @apiParam (param) {String}  id             ID of transaction
   */
  findOne: (req, res) => {
    const tag = `${req.uid} OfferController.findOne:`
    const { id } = req.params
  },

  /**
   * @api {PUT} /api/offer/:id/cancel
   * @apiDescription Cancel an offer
   *
   * @apiParam (param) {String}  id             ID of transaction
   */
  cancel: (req, res) => {
    const tag = `${req.uid} OfferController.cancel:`
    const { id } = req.params
  },
}
