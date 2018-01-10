const request = require('request-promise')
const Promise = require('bluebird')
const winston = require('winston').cli() // enable colors
const _ = require('lodash')

module.exports = {
  /**
   * @api {POST} /api/user/
   * @apiDescription Create a user
   *
   * @apiParam (body) {String}  uid         ID of user
   * @apiParam (body) {String}  photoUrl    ID of user photo
   * @apiParam (body) {String}  email       Email of user
   * @apiParam (body) {String}  phoneNumber ID of user
   *
   * @apiSuccess (201) -        Created user
   */
  create: (req, res) => {
    const tag = `${req.uid} UserController.create:`
    const body = req.body

    return firestore.collection('users').doc().set(body)
      .then(() => {
        winston.info(tag, `User ${req.body.uid} created`)
        return res.status(201).end()
      })
      .catch(err => {
        winston.error(tag, err)
        return res.status(500).json({ message: 'Server Error' })
      })
  },

  /**
   * @api {GET} /api/user/:id
   * @apiDescription Find a user
   *
   * @apiParam (param) {String}  id       ID of user
   *
   * @apiSuccess (200) {Object}  -        User object
   * @apiError (404)   UserNotFound       User does not exist
   */
  findOne: (req, res) => {
    const tag = `${req.uid} UserController.findOne:`
    const { id } = req.params

    return firestore.collection('users').where('uid', '==', id)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          throw new Error('UserNotFound')
        }

        const result = []
        snapshot.forEach(doc => {
          result.push(doc.data())
        })
        const user = result[0]
        return user
      })
      .then(user => {
        return res.send(user)
      })
      .catch({ message: 'UserNotFound' }, err => {
        winston.error(tag, err)
        return res.status(404).json({ message: `User ${id} not found` })
      })
      .catch(err => {
        winston.error(tag, err)
        return res.status(500).json({ message: 'Server Error' })
      })
  },
}
