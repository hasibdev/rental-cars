import { SetupCalendar } from 'v-calendar'
import Toast from "vue-toastification"
import vClickOutside from "click-outside-vue3"
import AppLink from '@/components/base/AppLink.vue'
import InputControl from "@/components/dashboard/form/InputControl.vue"
import CurrencyControl from "@/components/dashboard/form/CurrencyControl.vue"
import SelectControl from "@/components/dashboard/form/SelectControl.vue"
import Loading from '@/components/common/Loading.vue'
import VueSignaturePad from 'vue-signature-pad'
import VueChartkick from 'vue-chartkick'
import moment from 'moment'

import 'v-calendar/dist/style.css'
import "vue-toastification/dist/index.css"
import 'chartkick/chart.js'

const toastConfig = {
  timeout: 1000,
  containerClassName: 'toast__container',
  hideProgressBar: true
}

export default app => {
  app.use(SetupCalendar, {})
  app.use(Toast, toastConfig)
  app.use(vClickOutside)
  app.use(VueSignaturePad)
  app.use(VueChartkick)

  app.component('app-link', AppLink)
  app.component('InputControl', InputControl)
  app.component('CurrencyControl', CurrencyControl)
  app.component('SelectControl', SelectControl)
  app.component('Loading', Loading)

  // Global Properties
  app.config.globalProperties.moment = moment
}
