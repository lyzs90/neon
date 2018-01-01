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
  }
}
