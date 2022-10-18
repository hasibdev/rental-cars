import axios from "axios";

const http = {};

http.get =  async function (url) {
    try {
        const res = await axios.get(url)
        return Promise.resolve(res.data)
    } catch (err) {        
        return Promise.reject(err)
    }
}

http.post =  async function (url, formData, configs = {}) {
    try {
        const res = await axios.post(url, formData, configs)
        return Promise.resolve(res.data)
    } catch (err) {        
        return Promise.reject(err)
    }
}

http.delete =  async function (url) {
    try {
        const res = await axios.delete(url)
        return Promise.resolve(res.data)
    } catch (err) {        
        return Promise.reject(err)
    }
}

export default http