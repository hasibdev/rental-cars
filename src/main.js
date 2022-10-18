import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import i18n from './plugins/i18n'
import router from './router'
import './plugins/axios'
import globalComponents from './plugins/globalComponents'
import api from './plugins/api'
// import  VueGoogleMaps from '@fawmi/vue-google-maps'
import 'bootstrap/dist/js/bootstrap.bundle'
import './styles/app.scss'


const app = createApp(App)

app.use(i18n)
app.use(createPinia())
app.use(router)
app.use(api)

app.use(globalComponents)
// app.use(VueGoogleMaps, {
//   load: {
//     key: "Add Your Google Map Key",
//   }
// })

// app.use(VueGoogleMaps)

export const moneyFormat = (num) => {
  if (isNaN(Number(num))) return
  return Number(num).toLocaleString('de-DE', {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "EUR"
  })
}
export const apiBaseUrl = process.env.VUE_APP_IMAGE_URL
export const imageBaseUrl = (url) => `${apiBaseUrl}/public${url}`

app.config.globalProperties.moneyFormat = moneyFormat
app.config.globalProperties.imageBaseUrl = imageBaseUrl

app.mount('#app')
