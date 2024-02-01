import request from '../utils/request'

/**
 * 查询菜单列表
 * @param data
 * @returns {AxiosPromise}
 */
export function selectList(data) {
  return request({
    url: '/api/menuList/selectList',
    method: 'get',
    params: data
  })
}

/**
 * 分页查询菜单
 * @param data
 * @returns {AxiosPromise}
 */
export function selectPage(data) {
  return request({
    url: '/api/menuList/selectPage',
    method: 'get',
    params: data
  })
}

/**
 * 根据id删除菜单
 * @param data
 * @returns {AxiosPromise}
 */
export function removeById(data) {
  return request({
    url: '/api/menuList/removeById',
    method: 'post',
    data
  })
}

/**
 * 添加或者更新菜单
 * @param data
 * @returns {AxiosPromise}
 */
export function saveOrUpdate(data) {
  return request({
    url: '/api/menuList/saveOrUpdate',
    method: 'post',
    data
  })
}
