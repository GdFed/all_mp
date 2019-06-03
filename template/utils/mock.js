import Mock from 'mockjs'
export default function mock (path) {
  let mockData = {}
  switch (path) {
    case '/api/XXXX':
      mockData = Mock.mock({
        _errCode: 1,
        _errStr: 'test',
        data: ''
      })
      break
  }
  return mockData
}
