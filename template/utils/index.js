import sha1 from 'sha1'

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNum).join('/')
  const t2 = [hour, minute, second].map(formatNum).join(':')

  return `${t1} ${t2}`
}

/**
 * 追加参数到url
 */
export function buildQuery (url, name, value) {
  if (url.indexOf('?') === -1) {
    url += '?'
  } else {
    url += '&'
  }
  url += name + '=' + value
  return url
}

/**
 * 追加多个参数到url
 */
export function buildQuerys (url, obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      url = buildQuery(url, key, obj[key])
    }
  }
  return url
}

/**
 * 显示错误信息弹窗
 */
export function toast ({ content, onFinish }) {
  wx.showModal({
    title: '提示',
    content: content,
    showCancel: false,
    complete () {
      onFinish && onFinish()
    }
  })
}

// 数字签名
export function signUrl (config) {
  // querystring
  let obj = {}
  let objArr = config.url.split('?')[1].split('&')
  for (let i = 0; i < objArr.length; i++) {
    let param = objArr[i].split('=')
    if (param[0] !== 'page') {
      obj[param[0]] = param[1]
    }
  }
  // querystring 与 post的params合并签名
  obj = Object.assign(obj, config.body)
  let sign = ''
  let queryString = '?'
  let objKeys = Object.keys(obj)
  objKeys = objKeys.filter(item => item !== 'sign')
  objKeys = objKeys.sort()
  for (let j = 0; j < objKeys.length; j++) {
    sign += objKeys[j] + obj[objKeys[j]]
    queryString += objKeys[j] + '=' + obj[objKeys[j]] + '&'
  }
  sign += 'b7cab12b2b81385dd2cccb8ce67e4998'
  sign = sha1(sign)
  queryString += 'sign=' + sign
  return config.url.split('?')[0] + queryString
}

// 格式化日期对象
export function formatDate (stamp) {
  let date = stamp ? new Date(parseInt(stamp)) : new Date()
  let Y = date.getFullYear()
  let M = date.getMonth() + 1
  let D = date.getDate()
  let h = date.getHours()
  let m = date.getMinutes()
  let s = date.getSeconds()
  return {
    Y,
    M: formatNum(M),
    D: formatNum(D),
    h: formatNum(h),
    m: formatNum(m),
    s: formatNum(s)
  }
}

export const parseCountDown = (number, useDay = true) => {
  const day = useDay ? parseInt(number / 24 / 3600) : 0
  const hour = parseInt((number - day * 24 * 3600) / 3600)
  const minute = parseInt((number - day * 24 * 3600 - hour * 3600) / 60)
  const second = parseInt(number - day * 24 * 3600 - hour * 3600 - minute * 60)
  return {
    day: formatNum(day),
    hour: formatNum(hour),
    minute: formatNum(minute),
    second: formatNum(second)
  }
}

export function showModal ({ content, onFinish }) {
  wx.showModal({
    title: '提示',
    content: content,
    showCancel: false,
    complete () {
      onFinish && onFinish()
    }
  })
}
export function moneyFormat (money, type) {
  if (!parseInt(money)) return type ? '0' : '0.00'
  return type ? parseInt(money / 100) : `${parseInt(money / 100)}.${parseInt(money % 100 / 10)}${money % 10}`
}
// 根据key排序
export function sortByKey (arr, key) {
  arr.sort((x, y) => y[key] - x[key])
}

export function throttle (fn, threshhold) {
  // 记录上次执行的时间
  let last = 0
  // 定时器
  let timer = null
  // 默认间隔为 250ms
  threshhold || (threshhold = 250)
  // 返回的函数，每过 threshhold 毫秒就执行一次 fn 函数
  return function () {
    // 保存函数调用时的上下文和参数，传递给 fn
    let context = this
    let args = arguments
    let now = +new Date()
    // 如果距离上次执行 fn 函数的时间小于 threshhold，那么就放弃
    // 执行 fn，并重新计时
    if (last && now < last + threshhold) {
      clearTimeout(timer)
      // 保证在当前时间区间结束后，再执行一次 fn
      timer = setTimeout(function () {
        last = now
        fn.apply(context, args)
      }, threshhold)
    // 在时间区间的最开始和到达指定间隔的时候执行一次 fn
    } else {
      last = now
      fn.apply(context, args)
    }
  }
}

export function numberFormat (num) {
  if (num > 100000) {
    return num
  } else if (num > 10000) {
    return `0${num}`
  } else if (num > 1000) {
    return `00${num}`
  } else if (num > 100) {
    return `000${num}`
  } else if (num > 10) {
    return `0000${num}`
  } else {
    return `00000${num}`
  }
}

export default {
  formatTime,
  sortByKey,
  formatDate,
  throttle,
  numberFormat
}
