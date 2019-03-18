import gio from './utils/gio-minp'
import Vue from 'vue'
import App from './App'
import store from './store/index'
import apis from './api/index'
import wxs from './api/wxs'
import http from './utils/fetch'
import { isProd, version } from './config'
require('core-js/library/modules/_global.js').console = console

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
