// 获取历史时间轴参数
export interface HistoryParams {
  personName?: string
  // 时间范围 618-1014
  startYear: number
  endYear: number
  postTypeList: string[]
  historyEventTypeList: string[]
  individualEventTypeList: string[]
}
