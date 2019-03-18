import apis from '&/api/index'
import wxs from '&/api/wxs'
import only from 'only'

export default {
  namespaced: true,
  state: {
    // 微信登录授权code
    authCode: '',
    // 微信用户基本信息
    wxUserInfo: {},
    // 回收宝账户信息
    userInfo: wxs.getStorageSync('userInfo') || {},
    authCodeLoading: false,
    buttonGetUserInfoAllowClick: true,
    buttonGetUserTelAllowClick: true,
    allowAuthWarn: false,
    buttonGetPhoneAllowClick: true,
    isLogining: false,
    needGetUnionIdTimes: 0,
    needGetAuthTelTimes: 0,
    tokenTimes: 0
  },
  getters: {
    needGetUnionId (state) {
      return state.userInfo.needAuthorize === 1
    },
    needGetAuthTel (state) {
      return !state.userInfo.tel
    }
  },
  mutations: {
    setWxUserInfo: (state, data) => {
      state.wxUserInfo = data
      wxs.setStorageSync('wxUserInfo', data)
    },
    setAuthCode: (state, data) => {
      state.authCode = data
    },
    setUserInfo: (state, data) => {
      // if (state.tokenTimes === 0) {
      //   data.token = ''
      // }
      // state.tokenTimes++
      // if (state.needGetAuthTelTimes === 0) {
      //   data.tel = ''
      // }
      // state.needGetAuthTelTimes++
      // if (state.needGetUnionIdTimes === 0) {
      //   data.needAuthorize = 1
      // }
      // state.needGetUnionIdTimes++
      state.userInfo = data
      if (data.needAuthorize === 0) {
        data['avatarUrl'] = data['avatar']
        state.wxUserInfo = only(data, ['avatarUrl', 'city', 'country', 'gender', 'nickName', 'province'])
      }
      wxs.setStorageSync('userInfo', data)
    },
    setAuthCodeLoading: (state, data) => {
      state.authCodeLoading = !!data
    },
    setButtonGetUserInfoAllowClick: (state, data) => {
      state.buttonGetUserInfoAllowClick = data
    },
    setButtonGetUserTelAllowClick: (state, data) => {
      state.buttonGetUserTelAllowClick = data
    },
    setAllowAuthWarn: (state, data) => {
      state.allowAuthWarn = data
    },
    setButtonGetPhoneAllowClick: (state, data) => {
      state.buttonGetPhoneAllowClick = data
    },
    setLogining: (state, data) => {
      state.isLogining = data
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
    },

    // 回收宝登录
    async login ({ commit, state }, options = {}) {
      commit('setLogining', true)
      try {
        let getCodeRet = await wxs.getAuthCode()
        let ret = await apis.login({
          code: getCodeRet.code,
          from: options.from || ''
        })
        if (ret._errCode === '0') {
          commit('updateLoginState', true, {
            root: true
          })
          commit('setUserInfo', { ...state.userInfo, ...ret._data })
          options.success && options.success()
        }
      } catch (e) {
        console.log('store_user_login_error', e)
      }
      commit('setLogining', false)
    },

    // 个人中心解绑手机号, 只需去掉tel
    // async unbindTel ({ commit, state }) {
    //   let ret = await apis.unbindTel({ tel: state.userInfo.tel })
    //   if (ret._errCode === '0') {
    //     commit('setUserInfo', { ...state.userInfo, tel: '' })
    //   }
    // },

    // 绑定手机号
    async bindTel ({ commit, state }, { tel, code, changBind }) {
      let ret = await apis.bind({ tel, code, changBind })
      if (ret._errCode === '0') {
        commit('setUserInfo', {...state.userInfo, ...ret._data})
      }
    },

    // 登录是否过期
    checkLoginStatus ({ commit, state }) {
      return apis.checkLoginStatus()
    },

    /**
     * 当用户没有绑定手机号去下单时, 会默认将当前手机号绑定到下单的联系号码
     * updateUserInfo 的前提条件是 前端token存在而且未过期
     */
    async updateUserInfo ({ commit, state }) {
      let ret = await apis.getUserInfo()
      if (ret._errCode === '0') {
        if (ret._data.tel) {
          commit('setUserInfo', {
            ...state.userInfo,
            tel: ret._data.tel
          })
        }
      }
    },

    /**
     * 注：当 withCredentials 为 true 时，要求此前有调用过 wx.login 且登录态尚未过期，
     * 此时返回的数据会包含 encryptedData, iv 等敏感信息；
     * 当 withCredentials 为 false 时，不要求有登录态，返回的数据不包含 encryptedData, iv 等敏感信息。
     * 当 errMsg = getUserInfo:ok 不一定有 encryptedData iv 哈 可能还受其他因素制约
     */
    async onButtonGetUserInfo ({ commit, state, dispatch }, res) {
      const { userInfo, errMsg, encryptedData, iv } = res.target
      if (!state.buttonGetUserInfoAllowClick) return
      commit('setButtonGetUserInfoAllowClick', false)
      if (errMsg === 'getUserInfo:ok') {
        if (state.authCode) {
          await dispatch('updateAuthInfo', { encryptedData, iv, userInfo })
        } else {
          // 未能获取到授权code
          wx.showModal({ title: '授权失败请重试', showCancel: false })
        }
      }
      await dispatch('getAuthCode')
      commit('setAllowAuthWarn', errMsg !== 'getUserInfo:ok')
      commit('setButtonGetUserInfoAllowClick', true)
    },

    // 解密微信信息
    async updateAuthInfo ({ commit, state, dispatch }, { encryptedData, iv, userInfo }) {
      commit('setWxUserInfo', userInfo)
      try {
        let ret = await apis.saveLiteAppUserInfo({ encryptedData, iv, code: state.authCode })
        if (ret._errCode === '0') {
          commit('setUserInfo', {...state.userInfo, ...ret._data})
        }
      } catch (error) {
        // None
      }
    },

    // 解密微信手机号
    async onGetPhoneInfo ({ commit, state, dispatch }, res) {
      const { errMsg, iv, encryptedData } = res.target
      if (!state.buttonGetUserTelAllowClick) return
      commit('setButtonGetUserTelAllowClick', false)
      if (errMsg === 'getPhoneNumber:ok') {
        try {
          if (state.authCode) {
            const ret = await apis.decrypMobile({ iv, encryptedData, code: state.authCode })
            if (parseInt(ret._errCode) === 0) {
              const tel = ret._data.tel
              if (tel) {
                commit('setUserInfo', { ...state.userInfo, tel })
                if (res.gotourl) {
                  wxs.navigateTo({ url: res.gotourl })
                }
              }
            }
          } else {
            // 未能获取到授权code
            wx.showModal({ title: '授权失败请重试', showCancel: false })
          }
        } catch (e) {
          // Nothing
          commit('setButtonGetUserTelAllowClick', true)
        }
      } else {
        wxs.navigateTo({ url: '/pages/bind/main' })
      }
      await dispatch('getAuthCode')
      commit('setButtonGetUserTelAllowClick', true)
    }
  }
}
