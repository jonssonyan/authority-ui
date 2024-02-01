import request from '../utils/request'

/**
 * 添加或者更新角色
 * @param data
 * @returns {AxiosPromise}
 */
export function saveOrUpdate(data) {
  return request({
    url: '/api/role/saveOrUpdate',
    method: 'post',
    data
  })
}

/**
 * 根据id删除角色
 * @param data
 * @returns {AxiosPromise}
 */
export function removeById(data) {
  return request({
    url: '/api/role/removeById',
    method: 'post',
    data
  })
}

/**
 * 根据id查询角色
 * @param data
 * @returns {AxiosPromise}
 */
export function getById(data) {
  return request({
    url: '/api/role/getById',
    method: 'get',
    params: data
  })
}

/**
 * 分页查询角色
 * @param data
 * @returns {AxiosPromise}
 */
export function selectPage(data) {
  return request({
    url: '/api/role/selectPage',
    method: 'get',
    params: data
  })
}

/**
 * 查询角色列表
 * @param data
 * @returns {AxiosPromise}
 */
export function select(data) {
  return request({
    url: '/api/role/select',
    method: 'get',
    params: data
  })
}
