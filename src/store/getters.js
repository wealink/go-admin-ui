const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.login.token,
  avatar: state => state.login.avatar,
  username: state => state.login.username,
  roles: state => state.login.roles,
  permission_routes: state => state.permission.routes
}
export default getters
