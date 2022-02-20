import request from '@/utils/request'

/**
 * 获取分类
 * @returns
 */
export const getCategoryList = () => {
  return request({
    url: '/home/category/head'
  })
}

/**
 * 获取单个顶级分类信息
 * @param {String} id - 顶级分类ID
 */
export const findTopCategory = (id) => {
  return request({
    url: '/category',
    params: { id }
  })
}

/**
 * 获取二级分类筛选条件数据
 * @param {String} id - 二级分类ID
 */
export const findSubCategoryFilter = (id) => {
  return request(
    {
      url: '/category/sub/filter',
      params: { id }
    }
  )
}

/**
 * 获取分类下的商品（带筛选条件）
 * @param {Object} params - 可参考接口文档
 */
export const findSubCategoryGoods = (data) => {
  return request({
    url: '/category/goods/temporary',
    method: 'post',
    data
  })
}
