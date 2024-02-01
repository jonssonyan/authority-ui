import Cookies from 'js-cookie'

const TokenKey = 'Authorization'

/**
 * 获取token
 * @returns {*}
 */
export function getToken() {
  return Cookies.get(TokenKey)
}

/**
 * 设置token
 * @param token
 * @returns {*}
 */
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

/**
 * 移除token
 * @returns {*}
 */
export function removeToken() {
  return Cookies.remove(TokenKey)
}
