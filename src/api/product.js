import request from "../utils/request";

/**
 * 通过id查询产品
 * @param data
 * @returns {AxiosPromise}
 */
export function getById(data) {
    return request({
        url: '/api/product/getById',
        method: 'get',
        params: data
    })
}

/**
 * 查询产品列表
 * @param data
 * @returns {AxiosPromise}
 */
export function selectList(data) {
    return request({
        url: '/api/product/selectList',
        method: 'get',
        params: data
    })
}

/**
 * 查看指定分类的产品
 * @param data
 * @returns {AxiosPromise}
 */
export function selectByCategoryId(data) {
    return request({
        url: '/api/product/selectByCategoryId',
        method: 'get',
        params: data
    })
}

/**
 * 分页查询产品信息
 * @param data
 * @returns {AxiosPromise}
 */
export function selectPage(data) {
    return request({
        url: '/api/product/selectPage',
        method: 'get',
        params: data
    })
}

/**
 * 删除产品
 * @param data
 * @returns {AxiosPromise}
 */
export function removeById(data) {
    return request({
        url: '/api/product/removeById',
        method: 'post',
        data
    })
}

/**
 * 修改或者添加产品信息
 * @param data
 * @returns {AxiosPromise}
 */
export function saveOrUpdate(data) {
    return request({
        url: '/api/product/saveOrUpdate',
        method: 'post',
        data
    })
}
