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
export function exportByAuthorId(params) {
  return request({
    url: '/post/exportByAuthorId',
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
    url: `searchYear/searchByBirthYear?startYear=${startYear+10}&endYear=${startYear + 70}`,
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

// 列出历史事件类型
export function getHistoryEventListApi() {
  return request({
    method:'GET',
    url: 'biannian/paramList/listHistoryEventType'
  })
}

// 列出个人事件类型
export function getIndividualEventListApi() {
  return request({
    method:'GET',
    url: 'biannian/paramList/listIndividualEventType'
  })
}

// 列出编年史作品类型
export function getPostListApi() {
  return request({
    method:'GET',
    url: 'biannian/paramList/postTypeList'
  })
}

// 历史时间轴页面数据
export function getHistoryStaticsApi(params = {}) {
  return request({
    method:'GET',
    url: 'biannian/statics/listHistoryScrollStatics',
    params
  })
}

// 个人时间轴页面数据
export function getPersonStaticsApi(params = {}) {
  return request({
    method:'GET',
    url: 'biannian/statics/listPersonScrollStatics',
    params
  })
}

// 根据朝代列出年份信息
export function getYearByDynastyApi(params = {}) {
  return request({
    method:'GET',
    url: 'biannian/year/listYearInfoByDynasty',
    params
  })
}

// 根据皇帝列出年份信息
export function getYearByEmperorApi(params = {}) {
  return request({
    method:'GET',
    url: 'biannian/year/listYearInfoByEmperor',
    params
  })
}

// 根据年号列出年份信息
export function getYearByNianHaoApi(params = {}) {
  return request({
    method:'GET',
    url: 'biannian/year/listYearInfoByNianHao',
    params
  })
}

// 获取历史事件的重要事件
export function getImportantEventApi(params = {}) {
  return request({
    method:'GET',
    url: 'biannian/listImportantEventForHistoryPage',
    params
  })
}

// 获取个人时间轴的历史事件的重要事件
export function getPersonImportantEventApi(params = {}) {
  return request({
    method:'GET',
    url: 'biannian/listImportantEventForPerson',
    params
  })
}

// 获取个人时间轴的人物经历的重要事件
export function getIndividualImportantEventApi(params = {}) {
  return request({
    method:'GET',
    url: 'biannian/listImportantEventForIndividual',
    params
  })
}

// 获取个人时间轴的相关人物的信息
export function getPersonInfoApi(params = {}) {
  return request({
    method:'GET',
    url: 'biannian/listRelatedPersonInfo',
    params
  })
}

// 获取落地页头部统计数据
export function getTotalCountApi(params = {}) {
  return request({
    method:'GET',
    url: 'biannian/landPage/getTotalCount',
    params
  })
}

// 落地页图标-人物权重词云
export function getlandPageApi(params = {}) {
  return request({
    method:'GET',
    url: 'biannian/landPage/listPersonWeight',
    params
  })
}

// 落地页图标-作品分类统计
export function getTotalCountAndPercentApi(params = {}) {
  return request({
    method:'GET',
    url: 'biannian/landPage/getPostTotalCountAndPercent',
    params
  })
}

// 落地页图表-年份折线图
export function getListYearPostWeightApi(params = {}) {
  return request({
    method:'GET',
    url: 'biannian/landPage/listYearPostWeight',
    params
  })
}

// 根据开始结束年份列出年份具体信息
export function getMainPersonEventApi(params = {}) {
  return request({
    method:'GET',
    url: 'biannian/year/listYearDetailByStartYearAndEndYear',
    params
  })
}


// 历史时间轴看板页面人物概览-人物事件关系
export function getListPersonBoardApi(params = {}) {
  return request({
    method:'GET',
    url: 'biannian/historyPageBoard/listPersonBoard',
    params
  })
}

// 历史时间轴看板页面事件标签概览-事件标签关系
export function getEventIndividualBoardApi(params = {}) {
  return request({
    method:'GET',
    url: 'biannian/historyPageBoard/listEventIndividualBoard',
    params
  })
}

// 历史时间轴看板页面事件地址概览-事件地址关系
export function getEventAddressBoardApi(params = {}) {
  return request({
    method:'GET',
    url: 'biannian/historyPageBoard/listEventAddressBoard',
    params
  })
}
