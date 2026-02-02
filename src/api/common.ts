import request from '@/utils/request';
export function findAuthorByAuthorId(params) {
  return request({
    url: '/api/system/matchAuthor/findAuthorByAuthorId',
    method: 'get',
    params
  });
}


export function login(params) {
  return request({
    url: '/api/admin/login',
    method: 'post',
    params
  });
}
export function logout(params) {
  return request({
    url: '/api/admin/logout',
    method: 'post',
    params
  });
}

/////////////////////////下面的是业务api

export function searchAuthor(params) {
  return request({
    url: '/api/searchPoet/searchPoetName',
    method: 'get',
    params
  });
}
export function searchPoetAuthorId(params) {
  return request({
    url: '/api/searchPoet/searchPoetAuthorId',
    method: 'get',
    params
  });
}
export function listPostPage(params) {
  return request({
    url: '/api/post/listPostPageByAuthorId',
    method: 'get',
    params
  });
}
export function exportByAuthorId(params) {
  return request({
    url: '/api/post/exportByAuthorId',
    method: 'get',
    params
  });
}
export function searchPostTitle(params) {
  return request({
    url: '/api/searchPost/searchPostTitle',
    method: 'get',
    params
  });
}
export function searchPostContent(params) {
  return request({
    url: '/api/searchPost/searchPostContent',
    method: 'get',
    params
  });
}
/////////////////////////下面的是知识图谱api
export function findAuthorIdByPersonId(params) {
  return request({
    url: '/api/common/findAuthorIdByPersonId',
    method: 'get',
    params
  });
}

export function listPersonByRelation(params) {
  return request({
    url: '/api/poet/listPersonByRelation',
    method: 'get',
    params
  });
}

export function listPersonAssocCode(params) {
  return request({
    url: '/api/assoc/listPersonAssocCode',
    method: 'get',
    params
  });
}
