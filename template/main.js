import gio from './utils/gio-minp'
import Vue from 'vue'
import App from './App'
import store from './store/index'
import apis from './api/index'
import wxs from './api/wxs'
import { isProd, version } from './config'
import http from './utils/fetch'
require('core-js/library/modules/_global.js').console = console

// Promise.prototype.finally = function (callback) {
//   let P = this.constructor
//   return this.then(
//     value => P.resolve(callback()).then(() => value),
//     reason => P.resolve(callback()).then(() => { throw reason })
//   )
// }

Vue.config.productionTip = false
App.mpType = 'app'

if (isProd) {
  gio('init', 'giokey', 'appid', {
    vue: Vue,
    version: version,
    forceLoginL: true,
    debug: false
  })
}

Vue.prototype.$store = store
Vue.prototype.$apis = apis
Vue.prototype.$wxs = wxs
Vue.prototype.$gio = gio
Vue.prototype.$http = http
Vue.prototype.$isProd = isProd

const app = new Vue(App)
app.$mount()
