import request from '@/utils/request'

/**
 * 获取收藏分页数据
 * @param {*} param0
 * @returns
 */
export const findCollect = ({ page = 1, pageSize = 10, collectType = 1 }) => {
  return request({
    url: '/member/collect',
    params: {
      page, pageSize, collectType
    }
  })
}
