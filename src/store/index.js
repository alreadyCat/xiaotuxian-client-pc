import { createStore } from 'vuex'
import cart from './modules/cart'
import user from './modules/user'
import category from './modules/category'
import createPersistedState from 'vuex-persistedstate'
export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    cart, user, category
  },
  plugins: [createPersistedState({
    // 本地存储名字
    key: 'xiaotuxian-client-pc',
    // 指定需要存储的仓库
    path: ['user', 'cart']
  })]
})
