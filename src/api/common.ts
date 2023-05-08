import request from '@/utils/request';
//获取用户状态信息
export function findUmatchAuthor(params) {
    return request({
        url: '/system/matchAuthor/findUnMatchAuthor',
        method: 'get',
        params
    });
}
export function findAuthorByAuthorId(params) {
    return request({
        url: '/system/matchAuthor/findAuthorByAuthorId',
        method: 'get',
        params
    });
}
export function findPersonByPersonId(params) {
    return request({
        url: '/system/matchAuthor/findPersonByPersonId',
        method: 'get',
        params
    });
}
export function listAllAuthor(params) {
    return request({
        url: '/system/matchAuthor/listAllAuthor',
        method: 'get',
        params
    });
}
export function doMatchAuthor(params) {
    return request({
        url: '/system/matchAuthor/doMatchAuthor',
        method: 'post',
        params
    });
}
export function login(params) {
    return request({
        url: '/admin/login',
        method: 'post',
        params
    });
}
export function logout(params) {
    return request({
        url: '/admin/logout',
        method: 'post',
        params
    });
}