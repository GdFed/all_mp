import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import config from '&/config'

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
    userInfo: wx.getStorageSync('userInfo'),
    systemInfo: wx.getStorageSync('systemInfo')
  },
  mutations: {
    setIphoneX (state, data) {
      state.iphoneX = data
    },
    setSystemInfo (state, data) {
      state.systemInfo = data
      wx.setStorageSync('systemInfo', data)
    },
    setUserInfo (state, data) {
      state.userInfo = data
      wx.setStorageSync('userInfo', data)
    }
  },
  getters: {
    needAuthInfo (state) {
      return !state.userInfo.avatarUrl
    },
    needAuthTel (state) {
      return !state.userInfo.phoneNumber
    }
  },
  actions: {
    async getSystemInfo ({ commit }) {
      try {
        let ret = wx.getSystemInfoSync()
        const { model } = ret
        commit('setSystemInfo', ret)
        commit('setIphoneX', model.search('iPhone X') !== -1)
      } catch (e) {
        console.log(e)
      }
    }
  },
  modules: {
    user
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => wx.getStorageSync(key),
        setItem: (key, value) => wx.setStorageSync(key, value),
        removeItem: key => {}
      }
    })
  ]
})

export default store
