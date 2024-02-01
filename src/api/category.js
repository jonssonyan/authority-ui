import request from '../utils/request'

/**
 * 分页查询分类
 * @param data
 * @returns {AxiosPromise}
 */
export function selectPage(data) {
  return request({
    url: '/api/category/selectPage',
    method: 'get',
    params: data
  })
}

/**
 * 单个删除分类
 * @param data
 * @returns {AxiosPromise}
 */
export function removeById(data) {
  return request({
    url: '/api/category/removeById',
    method: 'post',
    data
  })
}

/**
 * 修改或者更新分类
 * @param data
 * @returns {AxiosPromise}
 */
export function saveOrUpdate(data) {
  return request({
    url: '/api/category/saveOrUpdate',
    method: 'post',
    data
  })
}

/**
 * 查询某人创建的分类，但是排除当前选中的分类，用户修改分类使用
 * @param data
 * @returns {AxiosPromise}
 */
export function select(data) {
  return request({
    url: '/api/category/select',
    method: 'get',
    params: data
  })
}

/**
 * 查询分类，嵌套数据结构
 * @param data
 * @returns {AxiosPromise}
 */
export function selectChilds(data) {
  return request({
    url: '/api/category/selectChilds',
    method: 'get',
    params: data
  })
}

/**
 * 通过id查询分类
 * @param data
 * @returns {AxiosPromise}
 */
export function getById(data) {
  return request({
    url: '/api/category/getById',
    method: 'get',
    params: data
  })
}
