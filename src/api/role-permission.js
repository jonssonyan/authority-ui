import request from '../utils/request'

/**
 * 添加或者更新角色和权限关系
 * @param data
 * @returns {AxiosPromise}
 */
export function saveOrUpdate(data) {
  return request({
    url: '/api/rolePermission/saveOrUpdate',
    method: 'post',
    data
  })
}

/**
 * 根据id删除角色和权限关系
 * @param data
 * @returns {AxiosPromise}
 */
export function removeById(data) {
  return request({
    url: '/api/rolePermission/removeById',
    method: 'post',
    data
  })
}

/**
 * 分页查询角色和权限关系
 * @param data
 * @returns {AxiosPromise}
 */
export function selectPage(data) {
  return request({
    url: '/api/rolePermission/selectPage',
    method: 'get',
    params: data
  })
}

/**
 * 根据id查询角色和权限关系
 * @param data
 * @returns {AxiosPromise}
 */
export function getById(data) {
  return request({
    url: '/api/rolePermission/getById',
    method: 'get',
    params: data
  })
}
