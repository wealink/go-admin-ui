import request from '@/utils/request'

// 查询登录登出日志列表
export function listOptlog(query) {
  return request({
    url: '/api/v1/optlogs',
    method: 'get',
    params: query
  })
}