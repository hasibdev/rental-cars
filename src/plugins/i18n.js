import { createI18n } from 'vue-i18n'

// load locale directory
function loadLocaleMessages() {
  const locales = require.context('../locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key).default
    }
  })
  return messages
}

export default createI18n({
  locale: localStorage.getItem('lang') || process.env.VUE_APP_DEFAULT_LANG,
  legacy: false,
  // allowComposition: true,
  fallbackLocale: ['de', 'en'],
  messages: loadLocaleMessages(),
  datetimeFormats: {
    en: {
      short: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }
    },
    de: {
      short: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }
    }
  }
})
