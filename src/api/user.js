import request from '@/utils/request'

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/api/v1/users',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(id) {
  return request({
    url: '/api/v1/user/' + id,
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/api/v1/users',
    method: 'post',
    data: data
  })
}

// 编辑用户信息
export function editUser(data) {
  return request({
    url: '/api/v1/users/' + data.id,
    method: 'PUT',
    data: data
  })
}

// 删除用户
export function delUser(id) {
  return request({
    url: '/api/v1/users/' + id,
    method: 'delete'
  })
}

// 重置用户密码
export function resetUserPwd(id, password) {
  const data = {
    id,
    password
  }
  return request({
    url: '/api/v1/user/' + id,
    method: 'PUT',
    data: data
  })
}
