const request = require('request-promise')
const Promise = require('bluebird')
const winston = require('winston').cli() // enable colors
const _ = require('lodash')

module.exports = {
  /**
   * @api {POST} /api/image
   * @apiDescription Upload an image to Firebase Storage
   *
   * @apiParam (body)  {String}  image        Image data, blob
   */
  create: (req, res) => {
    const tag = `${req.uid} ImageController.create:`
  },

  /**
   * @api {GET} /api/image/:id
   * @apiDescription Get one image of type png from Firebase Storage
   *
   * @apiParam (param) {String}  id             ID of image
   * @apiParam (query) {String}  folder         Folder name
   *
   * @apiSuccess (200) {String}   Base64 encoded string representing the image
   */
  findOne: (req, res) => {
    const tag = `${req.uid} ImageController.findOne:`
    const { id } = req.params
    const { folder } = req.query

    return storage
      .bucket()
      .file(`${folder}/${id}.png`)
      .download()
      .then(img => {
        const bufString = Buffer.from(img[0]).toString('base64')
        const imgData = `data:image/png;base64,${bufString}`
        return res.send(imgData)
      })
      .catch(err => {
        winston.error(tag, err)
        return res.status(500).json({ message: 'Server Error' })
      })
  },
}
