import Vue from 'vue'
import Vuex from 'vuex'
import config from '&/config'
import wxs from '&/api/wxs'

import user from './module/user'
Vue.use(Vuex)

const initPageInfo = {
  pageIndex: 1,
  pageSize: 30,
  total: 0,
  totalPage: 0
}

const store = new Vuex.Store({
  state: {
    ...config,
    pageInfo: {
      ...initPageInfo
    },
    iphoneX: false,
    systemInfo: wxs.getStorageSync('systemInfo')
  },
  mutations: {
    setIphoneX (state, data) {
      state.iphoneX = data
    },
    setSystemInfo (state, data) {
      state.systemInfo = data
      wxs.setStorageSync('systemInfo', data)
    }
  },
  actions: {
    async getSystemInfo ({ commit }) {
      try {
        let ret = await wxs.getSystemInfo()
        const { model } = ret
        commit('setSystemInfo', ret)
        commit('setIphoneX', model.search('iPhone X') !== -1)
      } catch (e) {
        console.log(e)
      }
    },
    callServicePhone ({ state }) {
      wx.makePhoneCall({ phoneNumber: state.serviceTel })
    }
  },
  modules: {
    user
  }
})

export default store
