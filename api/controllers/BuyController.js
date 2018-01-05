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
   */
  create: (req, res) => {
    const tag = `${req.uid} BuyController.create:`

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
   * @apiParam (query) {String}  [user_id]        ID of user to filter on
   */
  findAll: (req, res) => {
    const tag = `${req.uid} BuyController.findAll:`
    const { user_id } = req.query
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
