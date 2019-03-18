export default {
  /**
   * 获取微信授权code（有效期5分钟）
   */
  getAuthCode () {
    return new Promise((resolve, reject) => {
      wx.login({
        success (res) {
          resolve(res)
        },
        fail (res) {
          wx.showModal({
            title: '系统提示',
            content: '微信授权失败'
          })
          reject(res)
        }
      })
    })
  },
  getLocation () {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        altitude: true,
        success (res) {
          resolve(res)
        },
        fail (err) {
          reject(err)
        }
      })
    })
  },
  getSystemInfo () {
    return new Promise((resolve, reject) => {
      wx.getSystemInfo({
        complete (res) {
          if (res.errMsg === 'getSystemInfo:ok') {
            resolve(res)
          } else {
            reject(res)
          }
        }
      })
    })
  },
  checkSession () {
    return new Promise((resolve, reject) => {
      wx.checkSession({
        success: function (res) {
          resolve(res)
        },
        fail: function (res) {
          reject(res)
        }
      })
    })
  },
  navigateTo: wx.navigateTo,
  navigateToMiniProgram: wx.navigateToMiniProgram,
  reLaunch: wx.reLaunch,
  navigateBack: wx.navigateBack,
  setStorageSync: wx.setStorageSync,
  getStorageSync: wx.getStorageSync,
  showModal: wx.showModal,
  redirectTo: wx.redirectTo,
  switchTab: wx.switchTab,
  request: wx.request
}
