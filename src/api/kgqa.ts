import request from '@/utils/request';

/**
 * 搜索人物关系
 * @param params 搜索参数，包含name字段
 * @returns 人物关系数据
 */
export function searchName(params) {
  return request({
    url: '/neo4j/query',
    method: 'get',
    params
  });
}

/**
 * 获取人物资料
 * @param params 参数，包含character_name字段
 * @returns 人物资料和图片
 */
export function getProfile(params) {
  return request({
    url: '/neo4j/getAnswerProfile',
    method: 'get',
    params
  });
}

/**
 * 知识图谱问答
 * @param params 问答参数，包含name字段
 * @returns 问答结果和人物关系图数据
 */
export function kgqaAnswer(params) {
  return request({
    url: '/neo4j/getKGQAAnswer',
    method: 'get',
    params
  });
}
