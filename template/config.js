export const isProd = process.env.NODE_ENV === 'production'

export let pid = '1196'
export const platform = '2'
export const iconRoot = 'https://s1.huishoubao.com/static/m/wxapp/'
export const apiBase = 'https://api.huishoubao.com/'
export const baseHost = 'https://mobile.huishoubao.com/'
export const selfReportUri = 'https://logreport.huishoubao.com/selfreport/'

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
// 高德地图api key
export const gdKey = '19932279131320c2dbbbd31c7a8a05e7'

// 服务电话
export const serviceTel = '400-080-9966'

// 小程序版本号
export const version = 'V1.0.0'

export default {
  version,
  isProd,
  pid,
  baseHost,
  platform,
  apiBase,
  gdKey,
  validations,
  iconRoot,
  selfReportUri,
  serviceTel
}
