import request from '../utils/request'

/**
 *登录
 * @param data
 * @returns {AxiosPromise}
 */
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

/**
 * 注册
 * @param data
 * @returns {AxiosPromise}
 */
export function register(data) {
  return request({
    url: '/register',
    method: 'post',
    data
  })
}

/**
 * 注册时校验用户名是否存在
 * @param data
 * @returns {AxiosPromise}
 */
export function countUsername(data) {
  return request({
    url: '/countUsername',
    method: 'get',
    params: data
  })
}

/**
 * 分页查询用户
 * @param data
 * @returns {AxiosPromise}
 */
export function selectPage(data) {
  return request({
    url: '/api/user/selectPage',
    method: 'get',
    params: data
  })
}

/**
 * 添加或或者修改用户
 * @param data
 * @returns {AxiosPromise}
 */
export function saveOrUpdate(data) {
  return request({
    url: '/api/user/saveOrUpdate',
    method: 'post',
    data
  })
}

/**
 * 通过id删除用户
 * @param data
 * @returns {AxiosPromise}
 */
export function removeById(data) {
  return request({
    url: '/api/user/removeById',
    method: 'post',
    data
  })
}

/**
 * 通过id查询用户
 * @param data
 * @returns {AxiosPromise}
 */
export function getById(data) {
  return request({
    url: '/api/user/getById',
    method: 'get',
    params: data
  })
}

/**
 * 注销登录，前提是在登录状态
 * @param data
 * @returns {AxiosPromise}
 */
export function loginOut(data) {
  return request({
    url: '/api/user/loginOut',
    method: 'post',
    data
  })
}
