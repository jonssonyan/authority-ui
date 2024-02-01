import request from '../utils/request'

/**
 * 分页查询角色和菜单关系
 * @param data
 * @returns {AxiosPromise}
 */
export function selectPage(data) {
  return request({
    url: '/api/roleMenuList/selectPage',
    method: 'get',
    params: data
  })
}
