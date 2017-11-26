const { join } = require('path')

module.exports = {
  /*
  ** Headers of the page
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

  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
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

  /*
  ** Modules
  */
  modules: [
    '@nuxtjs/dotenv'
  ],

  /*
  ** Plugins
  */
  plugins: [
    '~plugins/vuetify.js',
    '~plugins/firebaseAuth.js'
  ],

  /*
  ** Stylesheets
  */
  css: [
    { src: join(__dirname, 'css/app.styl'), lang: 'styl' }
  ],

  /*
  ** Router
  */
  router: {
    middleware: 'routerAuth'
  }
}
