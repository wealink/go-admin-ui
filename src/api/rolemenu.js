import request from '@/utils/request'

// 通过ID查询菜单树
export function listTreeRoleMenu(id) {
  return request({
    url: '/api/v1/treerolemenus/' + id,
    method: 'get'
  })
}

// 查询所有角色和
export function getRoutes() {
  return request({
    url: '/api/v1/rolemenus',
    method: 'get'
  })
}

