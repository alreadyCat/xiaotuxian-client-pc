import request from '@/utils/request'

/**
 * limit  {Integer}  --- 品牌个数
 */

export const getBrand = (limit = 6) => { // 获取品牌数据
  return request({
    url: '/home/brand',
    params: {
      limit
    }
  })
}
/**
 * 获取轮播图
 * @returns Promise
 */
export const findBanner = () => {
  return request({
    url: '/home/banner'
  })
}

/**
 *
 * 获取新鲜好物数据
 */
export const findNew = () => {
  return request({
    url: 'home/new'
  })
}

/**
 *
 *   获取人气推荐数据
 *
 */
export const findHot = () => {
  return request({
    url: 'home/hot'
  })
}

/**
 * 获取商品数据
 * @returns
 */
export const findGoods = () => {
  return request({
    url: 'home/goods'
  })
}

/**
 * 获取最新专题数据
 * @returns
 *
 */
export const findSpecial = () => {
  return request({ url: 'home/special' })
}
