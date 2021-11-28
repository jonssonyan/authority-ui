import request from "../utils/request";

/**
 * 分页查询订单
 * @param data
 * @returns {AxiosPromise}
 */
export function selectPage(data) {
    return request({
        url: '/api/order/selectPage',
        method: 'get',
        params: data
    })
}

/**
 * 根据id查询订单
 * @param data
 * @returns {AxiosPromise}
 */
export function getById(data) {
    return request({
        url: '/api/order/getById',
        method: 'get',
        params: data
    })
}

/**
 * 删除订单
 * @param data
 * @returns {AxiosPromise}
 */
export function removeById(data) {
    return request({
        url: '/api/order/removeById',
        method: 'post',
        data
    })
}

/**
 * 添加或者更新订单
 * @param data
 * @returns {AxiosPromise}
 */
export function saveOrUpdate(data) {
    return request({
        url: '/api/order/saveOrUpdate',
        method: 'post',
        data
    })
}
