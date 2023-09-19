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
export function findAuthorByAuthorName(params) {
    return request({
        url: '/system/matchAuthor/findAuthorByAuthorName',
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
export function findPersonByPersonName(params) {
    return request({
        url: '/poet/findByName',
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
export function  findAuthorIdByPersonId(params) {
    return request({
        url: '/common/findAuthorIdByPersonId',
        method: 'get',
        params
    });
}
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
export function listPersonAssocCode(params) {
    return request({
        url: '/assoc/listPersonAssocCode',
        method: 'get',
        params
    });
}
export function listTagGroup(params) {
    return request({
        url: '/tag/listTagGroup',
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
export function findTag(params) {
    return request({
        url: '/tag/findTag',
        method: 'get',
        params
    });
}
export function listStatusAuthorPage(params) {
    return request({
        url: '/tag/listStatusAuthorPageByStatusCode',
        method: 'get',
        params
    });
}
// 事件轴api
export function getTimeList(startYear) {
    return request({
        url: `searchYear/searchByBirthYear?startYear=${startYear}&endYear=${startYear + 100}`,
        method:'get'
    })
}
export function getTimeListRight(startYear) {
    return request({
        url: `searchYear/searchByDeathYear?startYear=${startYear}&endYear=${startYear + 100}`
    })
}
export function getInitData() {
    return request({
        method:'GET',
        url: 'searchYear/findInitParam'
    })
}