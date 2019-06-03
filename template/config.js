export const isProd = process.env.NODE_ENV === 'production'

export let pid = 'XXXX'
export const platform = '1'
export const apiBase = 'https://api.xxxx.com/'

export const validations = [{
  name: 'userName',
  rules: [{
    rule: /^.{2,}$/,
    error: '联系人为2个以上字符'
  }]
}, {
  name: 'address',
  rules: [{
    rule: /^.{4,}$/,
    error: '详细地址为4个及以上字符'
  }]
}, {
  name: 'tel',
  rules: [{
    rule: /^[1][0-9]{10}$/,
    error: '手机号码格式不正确'
  }]
}, {
  name: 'cardNumber',
  rules: [{
    rule: /^.{15,}$/,
    error: '身份证输入不正确'
  }]
}]

// 小程序版本号
export const version = 'V1.0.0'
export const appid = 'wx58f984ee339d8d54'
export const secret = '1de7409a53b7ba2e2540ad21844c424f'

export default {
  appid,
  secret,
  version,
  isProd,
  pid,
  platform,
  apiBase,
  validations
}
