import hack from './utils/hack'
import Vue from 'vue'
import App from './App'
import store from './store/index'
import api from './api/index'
import conf from './config'
import http from './utils/fetch'
import {func} from './utils'
let { isProd, version } = conf
require('core-js/library/modules/_global.js').console = console

Vue.config.productionTip = false
App.mpType = 'app'
Vue.use(hack)
if (!wx.cloud) {
  console.error('请使用 2.2.3 或以上的基础库以使用云能力')
} else {
  wx.cloud.init({
    env: 'demo'
  })
}

Vue.prototype.$gio = gio
Vue.prototype.$store = store
Vue.prototype.$api = api
Vue.prototype.$conf = conf
Vue.prototype.$http = http
Vue.prototype.$func = func

const app = new Vue(App)
app.$mount()
