import request from '../utils/request'

/**
 * 根据id查询权限
 * @param data
 * @returns {AxiosPromise}
 */
export function getById(data) {
  return request({
    url: '/api/permission/getById',
    method: 'get',
    params: data
  })
}

/**
 * 查询权限列表
 * @param data
 * @returns {AxiosPromise}
 */
export function selectPermission(data) {
  return request({
    url: '/api/permission/select',
    method: 'get',
    params: data
  })
}
