const pkg = require('./package')


module.exports = {
  mode: 'universal',
  router:{
    base: '/epwm/',
    middleware:'auth'
  },
  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: 'https://res.suning.cn/javascript/sn_da/sa_simple.js' },
      { src: 'https://res.suning.cn/javascript/sn_da/sa_click.js' }
    ],
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/vtap',
    {src:'~/plugins/pageLoadingBox',ssr:false},
    {src:'~/plugins/toastAlertBox',ssr:false},
    '~/plugins/eventBus.js',
    '~/plugins/topBar.js',
    {src:'~/plugins/common.js',ssr:false}
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, { isDev, isClient }) {
      // const vueLoader = config.module.rules.find((rule) => rule.loader === 'vue-loader');

      // vueLoader.options.loaders.sass = 'vue-style-loader!css-loader!sass-loader';

    }
  }
}
