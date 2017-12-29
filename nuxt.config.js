const { join } = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const winston = require('winston').cli() // enable colors
const uuidv4 = require('uuid/v4')
const morgan = require('morgan')
const url = require('url')
require('dotenv').config()

module.exports = {
  /**
   * Env to be shared on server & client. Otherwise, process.env can only be used serverside
   */
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    STRIPE_CLIENT_ID: process.env.STRIPE_CLIENT_ID
  },

  /**
   * Page Headers
   */
  head: {
    title: 'neon',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'The frontend' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preload', as: 'style', href: 'https://fonts.googleapis.com/css?family=Roboto' }
    ]
  },

  /**
   * Customize progress bar color
   */
  loading: { color: '#3B8070' },

  /**
   * Build Configuration
   */
  build: {
    /**
     * Run eslint on save
     */
    extend (config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },

    vendor: ['vuetify', 'firebase']
  },

  /**
   * Server Middlware
   *
   * Nuxt internally creates a connect instance, so we can register our
   * middleware to it's stack and having chance to provide more routes like API
   * without need to an external server.
   */
  serverMiddleware: [
    bodyParser.json(),

    // Attach uuid to each request
    (req, res, next) => {
      req.uid = uuidv4()

      const previewUrl = req.url.length < 75 ? req.url : req.url.slice(0, 72) + '...'

      if (req.method !== 'OPTIONS') {
        winston.info(`${req.uid} - Starting to process request for ${req.method} ${previewUrl}`)
      }

      next()
    },

    // Attach querystring to req.query FIXME: find out why this doesnt work OOTB
    (req, res, next) => {
      req.query = url.parse(req.url, true).query
      next()
    },
    morgan('dev'),
    session({
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 } // 1 hour
    }),
    '~/api' // Internal API routes
  ],

  /**
   * Modules
   */
  modules: [
    '@nuxtjs/dotenv',
    '@nuxtjs/pwa',
    '@nuxtjs/axios' // Axios is used on the client. Request is used on the server
  ],

  axios: {
    errorHandler (errorReason, { error }) {
      error(errorReason)
    }
  },

  /**
   * Plugins
   */
  plugins: [
    { src: '~plugins/vuetify.js', ssr: true },
    { src: '~plugins/firebaseAuth.js', ssr: false } // dont run on server because it needs localStorage
  ],

  /**
   * Stylesheets
   */
  css: [
    { src: join(__dirname, 'css/app.styl'), lang: 'styl' }
  ],

  /**
   * Router
   */
  router: {
    middleware: 'routerAuth'
  }
}
