import axios from "axios";

axios.defaults.baseURL= process.env.VUE_APP_API_URL
axios.defaults.headers.common['Accept-Language'] = localStorage.getItem('lang') || process.env.VUE_APP_DEFAULT_LANG