import request from '@/utils/request'

// 查询登录登出日志列表
export function listLoginlog(query) {
  return request({
    url: '/api/v1/loginlogs',
    method: 'get',
    params: query
  })
}
