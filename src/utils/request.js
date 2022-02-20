import axios from 'axios'
import store from '@/store'
import router from '@/router'
// 导出基准地址，比如图片上传用的不是axios
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'

const instance = axios.create({
  baseURL,
  timeout: 5000
})

instance.interceptors.request.use(config => {
  // 如果本地有token，就需要注入token
  const profile = store.state.user.profile
  if (profile.token) {
    config.headers.Authorization = 'Bearer ' + profile.token
  }

  return config
}, err => {
  return Promise.reject(err)
})

instance.interceptors.response.use(res => res.data, err => {
  // 401 token失效，登陆失败
  if (err.response && err.response.status === 401) {
    //   1. 清空无效信息
    //   2. 跳转到登录页面
    //   3. 跳转需要传参（当前路由地址，比如登录页）给登录页
    store.commit('user/setProfile', {})
    // 当前路由地址 组建中：$route.path  || $route.fullPath
    //  js 模块中：router.currentRoute.value.fullPath ,但是它是ref包装过的响应式数据，要拿他真正的数据需要.value
    const currentPath = encodeURIComponent(router.currentRoute.value.fullPath)
    // encodeURIComponent -- 转换uri编码，防止地址解析出错
    router.push('/login?redirectUrl=' + currentPath)
    return Promise.reject(err)
  }
})
export default instance
