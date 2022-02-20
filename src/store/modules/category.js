import { topCategory } from '@/api/constant'
import { getCategoryList } from '@/api/category'
export default {
  namespaced: true,
  state () {
    return {
      list: topCategory.map(item => ({ name: item }))
    }
  },
  mutations: {
    setList (state, payload) {
      state.list = payload
    },
    hide (state, id) {
      const currentCategory = state.list.find(item => item.id === id)
      currentCategory.open = false
    },
    show (state, id) {
      const currentCategory = state.list.find(item => item.id === id)
      currentCategory.open = true
    }
  },
  actions: {
    async getList (context) {
      const { result } = await getCategoryList()
      // 添加二级类目显示与隐藏属性
      result.forEach(item => {
        item.open = false
      })
      context.commit('setList', result)
    }
  }
}
