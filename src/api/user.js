import request from '@/utils/request'

/**
 * 帐号登录
 * @param {String} account - 用户名
 * @param {String} password - 密码
 * @returns Promise
 */
export const userAccountLogin = data => {
  return request({
    url: '/login',
    method: 'POST',
    data
  })
}

/**
 * 手机登录,获取验证码
 * @returns Promise
 */
export const userMobileLoginGetCode = (mobile) => {
  return request({
    url: '/login/code',
    params: {
      mobile
    }
  })
}

/**
 * 手机登录
 * @returns Promise
 */
export const userMobileLogin = (mobile, code) => {
  return request({
    url: '/login/code',
    method: 'post',
    data: {
      mobile, code
    }
  })
}

/**
 * @param {String} unionId:  qq唯一标识
 * @param {*} source ： 客户端类型 1 pc
 * qq登录
 */
export const userQQlogin = (unionId, source = 1) => {
  return request({
    url: '/login/social',
    method: 'post',
    data: {
      unionId,
      source
    }
  })
}

/**
 *
 * 获取QQ登录，手机号未绑定的短信验证码
 *
 */
export const userQQBindCode = mobile => {
  return request({
    url: '/login/social/code',
    params: {
      mobile
    }
  })
}
/**
 *
 * 手机号绑定
 *  params  : unionId  ,  mobile ,code
 *
 */
export const userQQBindMobile = data => {
  return request({
    url: '/login/social/bind',
    method: 'post',
    data
  })
}

/**
 * 验证账号唯一性
 * @param {*} account - 账号
 * @returns
 */
export const checkUserAccount = (account) => {
  return request({
    url: '/register/check',
    params: {
      account
    }
  })
}
/**
 * 完善信息获取 验证码
 * @param {*} mobile
 * @returns
 */
export const userQQPatchCode = (mobile) => {
  return request({
    url: '/register/code',
    params: {
      mobile
    }
  })
}

/**
 *
 * @param {*} unionId
 * @param {*} account
 * @param {*} password
 * @param {*} code
 * @param {*} mobile
 * @returns
 */
export const userQQBingLogin = ({ unionId, account, password, code, mobile }) => {
  return request({
    url: `/login/social/${unionId}/complement`,
    method: 'post',
    data: { account, password, code, mobile }
  })
}
