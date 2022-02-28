import { getNewCartGoods, mergeCart, findCartList, insertCart, deleteCart, updateCart, checkAllCart } from '@/api/cart'
export default {
  namespaced: true,
  state () {
    return {
      list: []
    }
  },
  getters: {
    // 有效商品列表
    validList (state) {
      return state.list.filter(item => item.stock && item.isEffective)
    },
    // 有效的件数
    validTotal (state, getters) {
      return getters.validList.reduce((prev, curr) => prev + curr.count, 0)
    },
    // 有效商品总金额
    validAmount (state, getters) {
      return getters.validList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100
    },
    // 无效商品列表
    invalidList (state) {
      return state.list.filter(item => item.stock <= 0 || !item.isEffective)
    },
    // 已选商品列表
    selectedList (state, getters) {
      return getters.validList.filter(item => item.selected)
    },
    // 已选商品总件数
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 已选商品总金额
    selectedAmount (state, getters) {
      return getters.selectedList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 是否全选
    isAllSelected (state, getters) {
      return (getters.validList.length === getters.selectedList.length) && getters.validList.length !== 0
    }
  },
  mutations: {
    insertCart (state, payload) {
      // 添加购物车规则需要判断购物车是否有相同的商品
      const index = state.list.findIndex(item => item.skuId === payload.skuId)
      if (index > -1) {
        const count = state.list[index].count
        console.log(payload)
        payload.count += count
        state.list.splice(index, 1)
      }
      state.list.unshift(payload)
    },
    // 修改购物车商品
    updateCart (state, goods) {
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      for (const key in goods) {
        if (goods[key] !== undefined && goods[key] !== null && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },
    // 删除购物车商品
    deleteCart (state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    },
    // 设置购物车
    setCart (state, payload) {
      state.list = payload
    }
  },
  actions: {
    // 合并购物车
    async mergeCart (context) {
      const cartList = context.state.list.map(goods => {
        return {
          skuId: goods.skuId,
          selected: goods.selected,
          count: goods.count
        }
      })
      console.log(cartList)
      await mergeCart(cartList)
      context.commit('setCart', [])
    },
    // 修改sku，规格
    updateCartSku (context, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
          const oldGoods = context.state.list.find(item => item.skuId === oldSkuId)
          deleteCart([oldGoods.skuId]).then(() => {
            return insertCart({ skuId: newSku.skuId, count: oldGoods.count })
          }).then(res => {
            return findCartList()
          }).then(data => {
            context.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          const oldGoods = context.state.list.find(item => item.skuId === oldSkuId)
          context.commit('deleteCart', oldSkuId)
          const { skuId, price: nowPrice, specsText: attrsText, inventory: stock } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, attrsText, stock }
          context.commit('insertCart', newGoods)
          resolve()
        }
      })
    },
    // 批量删除
    batchDeleteCart (context, isTrue) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
          const ids = context.getters[isTrue ? 'invalidList' : 'selectedList'].map(item => item.skuId)

          deleteCart(ids).then(res => {
            return findCartList()
          }).then(data => {
            context.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          context.getters[isTrue ? 'invalidList' : 'selectedList'].forEach(item => {
            context.commit('deleteCart', item.skuId)
          })
          resolve()
        }
      })
    },
    // 全选与取消全选
    checkAllCart (context, selected) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
          const ids = context.getters.validList.map(item => item.skuId)
          checkAllCart({ selected, ids }).then(res => {
            return findCartList()
          }).then(data => {
            context.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          context.getters.validList.forEach(goods => {
            context.commit('updateCart', { skuId: goods.skuId, selected })
          })
          resolve()
        }
      })
    },
    // 修改购物车
    updateCart (context, payload) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
          updateCart(payload).then(res => {
            return findCartList()
          }).then(data => {
            context.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          context.commit('updateCart', payload)
          resolve()
        }
      })
    },
    insertCart (context, payload) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
          insertCart({ skuId: payload.skuId, count: payload.count }).then(res => {
            return findCartList()
          }).then(data => {
            context.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          context.commit('insertCart', payload)
          resolve()
        }
      })
    },
    // 获取商品列表
    findCart (context) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          //
          findCartList().then(data => {
            context.commit('setCart', data.result)
          })
        } else {
          // 未登录
          const promiseArr = context.state.list.map(goods => {
            return getNewCartGoods(goods.skuId)
          })
          Promise.all(promiseArr).then(dataList => {
            dataList.forEach((data, i) => {
              context.commit('updateCart', { skuId: context.state.list[i].skuId, ...data.result })
            })
            resolve()
          })
        }
      })
    },
    // 删除购物车
    deleteCart (context, payload) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          //
          deleteCart([payload]).then(res => {
            return findCartList()
          }).then(data => {
            context.commit('setCart', data.result)
            resolve()
          })
        } else {
          context.commit('deleteCart', payload)
          resolve()
        }
      })
    }
  }
}
