import request from '@/utils/request'

// 查询菜单列表
export function listMenu(query) {
  return request({
    url: '/api/v1/menus',
    method: 'get',
    params: query
  })
}

// 查询菜单树
export function listTreeMenu() {
  return request({
    url: '/api/v1/treemenus',
    method: 'get'
  })
}

// 查询菜单详细
export function getMenu(id) {
  return request({
    url: '/api/v1/menu/' + id,
    method: 'get'
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/api/v1/menus',
    method: 'post',
    data: data
  })
}

// 更新菜单
export function editMenu(data) {
  return request({
    url: '/api/v1/menus/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delMenu(id) {
  return request({
    url: '/api/v1/menus/' + id,
    method: 'delete'
  })
}
