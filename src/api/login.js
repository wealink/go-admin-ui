import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/v1/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/v1/logout',
    method: 'get'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/getcode',
    method: 'get'
  })
}
