import { asyncRouters, constantRouters } from '@/router'
import { getRoutes } from '@/api/rolemenu'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
  * 后台查询的菜单数据拼装成路由格式的数据
  * @param routes
  */
export function generaMenu(routes, data) {
  data.forEach(item => {
    const menu = {
      path: item.path,
      component: item.componenturl === 'Layout' ? Layout : loadView(item.componenturl),
      name: item.name,
      meta: {
        roles: item.roles,
        title: item.title,
        icon: item.icon,
        noCache: true
      },
      // hidden: item.visible !== '0',
      children: []
    }
    if (item.children) {
      generaMenu(menu.children, item.children)
    }
    routes.push(menu)
  })
}

export const loadView = (view) => { // 路由懒加载
  return (resolve) => require(['@/views/' + view], resolve)
  // return () => import(`@/views${view}`)
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRouters.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes = ''
      // if (roles.includes('运维部')) {
      //  accessedRoutes = asyncRouters || []
      // } else {
      //  accessedRoutes = filterAsyncRoutes(asyncRouters, roles)
      // }
      const loadMenuData = []
      getRoutes().then(response => {
        // console.log(JSON.stringify(response))
        let data = response
        if (response.code !== 200) {
          this.$message({
            message: '菜单数据加载异常',
            type: 0
          })
        } else {
          data = response.data
          Object.assign(loadMenuData, data)
          generaMenu(asyncRouters, loadMenuData)
          console.log(asyncRouters)
          asyncRouters.push({ path: '*', redirect: '/404', hidden: true })
          accessedRoutes = filterAsyncRoutes(asyncRouters, roles)
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        }
      }).catch(error => {
        console.log(error)
      })
      // commit('SET_ROUTES', accessedRoutes)
      // resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
