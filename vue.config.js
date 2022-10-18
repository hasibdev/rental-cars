module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
            @import "@/styles/scss/_variables.scss";
            @import "@/styles/scss/_mixins.scss";
        `
      }
    }
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableLegacy: true,
      runtimeOnly: false,
      compositionOnly: true,
      fullInstall: true
    }
  },
  devServer: {
    // port: 8085, // CHANGE YOUR PORT HERE!
    // https: true,
  },

  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
    // .tap(options => {
    //   options.compilerOptions = {
    //     ...(options.compilerOptions || {}),
    //     isCustomElement: tag => tag === 'lottie-player'
    //   }
    //   return options
    // })
  }
}

