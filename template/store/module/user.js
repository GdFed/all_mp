import wxs from '&/api/wxs'

export default {
  namespaced: true,
  state: {
  },
  getters: {
  },
  mutations: {
    setAuthCode: (state, data) => {
      state.authCode = data
    }
  },
  actions: {
    // 获取wx.login授权code
    async getAuthCode ({ commit }) {
      commit('setAuthCodeLoading', true)
      const ret = await wxs.getAuthCode()
      if (ret['errMsg'] === 'login:ok') {
        commit('setAuthCode', ret.code)
      } else {
        console.log('获取登录code失败')
      }
      commit('setAuthCodeLoading', false)
    }
  }
}
