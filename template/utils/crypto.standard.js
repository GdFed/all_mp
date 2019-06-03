/* eslint-disable */
var cryptoFunc = require('crypto')

function decryptData (appid, sessionKey, encryptedData, iv) {
  // base64 decode
  sessionKey = new Buffer(sessionKey, 'base64')
  encryptedData = new Buffer(encryptedData, 'base64')
  iv = new Buffer(iv, 'base64')
  try {
    // 解密
    var decipher = cryptoFunc.createDecipheriv('aes-128-cbc', sessionKey, iv)
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true)
    var decoded = decipher.update(encryptedData, 'binary', 'utf8')
    decoded += decipher.final('utf8')
    decoded = JSON.parse(decoded)
  } catch (err) {
    throw new Error('Illegal Buffer')
  }
  if (decoded.watermark.appid !== appid) {
    throw new Error('Illegal Buffer')
  }
  return decoded
}
export default function crypto ({appid, secret, code, grantType, encryptedData, iv}) {
  grantType = grantType || 'authorization_code'
  return new Promise(async (resolve, reject) => {
    try {
      wx.request({
        url: `https://api.weixin.qq.com/sns/jscode2session?&appid=${appid}&secret=${secret}&js_code=${code}&grant_type=${grantType}`,
        success(ret) {
          if (+ret.statusCode === 200) {
            let sessionKey = ret.data.session_key
            let data = decryptData(appid, sessionKey, encryptedData, iv)
            resolve(data)
          } else {
            reject(ret)
          }
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}
