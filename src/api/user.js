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

// 用户管理 重置用户密码
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

// 个人中心 用户密码重置
export function updateUserPwd(oldpassword, newpassword) {
  const data = {
    oldpassword,
    newpassword
  }
  return request({
    url: '/api/v1/pwd',
    method: 'put',
    data: data
  })
}

// 个人中心 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/api/v1/uploadavatar',
    method: 'post',
    data: data
  })
}
