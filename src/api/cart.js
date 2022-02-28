import request from '@/utils/request'

/**
 *
 * @param {String} skuId
 * @returns
 */
export const getNewCartGoods = (skuId) => {
  return request({
    url: `/goods/stock/${skuId}`
  })
}

/**
 * 获取商品的specs和skus
 * @param {String} skuId - 商品SKUID
 * @returns Promise
 */
export const getSpecsAndSkus = (skuId) => {
  return request({
    url: `/goods/sku/${skuId}`
  })
}

/**
 * 合并购物车
 * @param {Array<object>} cartList
 * @param {String} object.skuId
 * @param {Boolean} object.selected
 * @param {Integer} object.count
 * @returns
 */
export const mergeCart = data => {
  return request({
    url: '/member/cart/merge',
    method: 'post',
    data
  })
}

/**
 * 获取登录后的购物车列表
 * @returns Promise
 */
export const findCartList = () => {
  return request({
    url: '/member/cart'
  })
}

/**
 * 加入购物车
 * @param {string} skuId
 * @param {string} count
 * @returns
 */
export const insertCart = ({ skuId, count }) => {
  return request({
    url: '/member/cart',
    method: 'post',
    data: {
      skuId,
      count
    }
  })
}

/**
 * 删除商品（支持批量删除）
 * @param {Array<string>} ids - skuId集合
 * @returns Promise
 */
export const deleteCart = (ids) => {
  return request({
    url: '/member/cart',
    method: 'delete',
    data: { ids }
  })
}

/**
 * 修改购物车商品的状态和数量
 * @param {String} goods.skuId - 商品sku
 * @param {Boolean} goods.selected - 选中状态
 * @param {Integer} goods.count - 商品数量
 * @returns Promise
 */
export const updateCart = (goods) => {
  return request({
    url: `/member/cart/${goods.skuId}`,
    method: 'put',
    data: goods
  })
}
/**
 * 全选反选
 * @param {Boolean} selected - 选中状态
 * @param {Array<string>} ids - 有效商品skuId集合
 * @returns Promise
 */
export const checkAllCart = ({ selected, ids }) => {
  return request({
    url: '/member/cart/selected',
    method: 'put',
    data: { selected, ids }
  })
}
