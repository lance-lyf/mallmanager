import axios from  'axios'
const myHttpSever = {}
myHttpSever.install = function (Vue) {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  Vue.prototype.$http = axios
}
export default myHttpSever