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

/////////////////////////下面的是业务api

export function searchAuthor(params) {
    return request({
        url: '/searchPoet/searchPoetName',
        method: 'get',
        params
    });
}
export function searchPoetAuthorId(params) {
    return request({
        url: '/searchPoet/searchPoetAuthorId',
        method: 'get',
        params
    });
}
export function listPostPage(params) {
    return request({
        url: '/post/listPostPageByAuthorId',
        method: 'get',
        params
    });
}
export function searchPostTitle(params) {
    return request({
        url: '/searchPost/searchPostTitle',
        method: 'get',
        params
    });
}
export function searchPostContent(params) {
    return request({
        url: '/searchPost/searchPostContent',
        method: 'get',
        params
    });
}
/////////////////////////下面的是知识图谱api
export function findSimplePoet(params) {
    return request({
        url: '/post/findSimplePoet',
        method: 'get',
        params
    });
}
export function listPersonByRelation(params) {
    return request({
        url: '/poet/listPersonByRelation',
        method: 'get',
        params
    });
}
export function listAssocCode(params) {
    return request({
        url: '/assoc/listAssocCode',
        method: 'get',
        params
    });
}
export function listTag(params) {
    return request({
        url: '/tag/listTag',
        method: 'get',
        params
    });
}