export default {
  namespaced: true,
  state: {
    authCode: ''
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
    getAuthCode ({ commit }) {
      wx.login({
        success (res) {
          if (res.code) {
            commit('setAuthCode', res.code)
          } else {
            wx.showToast({
              title: res.errMsg, // 提示的内容,
              icon: 'none'})
          }
        },
        fail (res) {
          wx.showToast({
            title: '授权失败,请稍后再试~', // 提示的内容,
            icon: 'none'})
        }
      })
    }
  }
}
