import Fly from 'flyio/dist/npm/wx'
import { buildQuery, signUrl } from './index'
import conf from '../config'
// import mock from './mock'
const fly = new Fly()

fly.config.timeout = 30000

fly.interceptors.request.use((config, promise) => {

  // current page route
  let currentPath = 'app'
  try {
    // /* eslint-disable no-undef */
    let pages = getCurrentPages()
    let currentPage = pages[pages.length - 1]['route']
    if (currentPage) {
      currentPath = currentPage
    }
  } catch (e) {
    //
  }

  // delete field of which value equal string undefined
  if (config.body) {
    for (let key in config.body) {
      if (config.body.hasOwnProperty(key)) {
        if (config.body[key] === 'undefined' || config.body[key] === '' || config.body[key] === undefined) {
          delete config.body[key]
        }
      }
    }
  }

  // build common query
  if (config.url.indexOf(conf.apiBase) !== -1) {
    config.url = buildQuery(config.url, 'version', conf.version)
    config.url = buildQuery(config.url, 'timestamp', Date.parse(new Date()))
    config.url = buildQuery(config.url, 'page', currentPath)
    config.url = signUrl(config.url, config.body)
  }

  if (config.method === 'POST') {
    if (!config.headers) {
      config.headers = {}
    }
    config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/x-www-form-urlencoded'
  }
  config.startTime = +new Date()
  config.routePath = config.url.split('.com')[1].split('?')[0]
  return config
})

fly.interceptors.response.use(
  res => {
    // console.log(res)
    try {
      return res.data
    } catch (err) {
      console.log(err)
    }
  },
  error => {
    // console.log(error)
    try {

      //mock数据
      if (+error.status === 404) {
        return Promise.resolve(mock(error.request.routePath))
      }

      return Promise.resolve({
        _errCode: error.status,
        _errStr: error.message,
        data: ''
      })
    } catch (err) {
      console.log(err)
    }
  }
)
export default fly
