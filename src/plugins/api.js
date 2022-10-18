import { useValidationStore } from '../stores/validation'
import axios from "axios"

// let validation = useValidationStore()
// setTimeout(() => {
//   validation = useValidationStore()
// }, 100)

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL
})

export default () => {
  const validation = useValidationStore()
  // Request handler
  api.interceptors.request.use(async function (config) {
    // Do something before request is sent
    //  Add auth token
    const token = localStorage.getItem('token')
    const lang = localStorage.getItem('lang')

    config.headers.common.Authorization = `Bearer ${token || ''}`
    config.headers.common['Accept-Language'] = lang || process.env.VUE_APP_DEFAULT_LANG


    // validation?.clearErrors()

    return config
  }, function (error) {
    // Do something with request error

    return Promise.reject(error)
  })

  // Response handler
  api.interceptors.response.use(function (config) {
    return config
  }, async function (error) {

    if (error.response?.status === 422) {
      const apiErrors = Array.isArray(error.response.data) ? error.response.data[0] : error.response.data
      validation?.setErrors(apiErrors)
    }

    return Promise.reject(error)
  }
  )
}

export {
  axios, api
}

