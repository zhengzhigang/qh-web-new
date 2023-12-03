// 汇总数据
const summaryData = {
  eventNumber: 12345,
  workNumber: 12345,
  relationNumber: 12345,
  title: '各年份事件数',
  list: [
    { year:618, events:20 },
    { year:628, events:8 },
    { year:638, events:50 },
    { year:648, events:55 },
    { year:658, events:20 },
    { year:668, events:47 },
    { year:678, events:28 },
    { year:688, events:66 },
    { year:698, events:80 },
    { year:708, events:55 },
    { year:718, events:37 },
    { year:728, events:50 },
    { year:738, events:67 }
  ]
}

// 历史事件选项
const historicalEventOptions = [
  { label: '历史一', value: 1 },
  { label: '历史二', value: 2 },
  { label: '历史三', value: 3 },
  { label: '历史四', value: 4 },
  { label: '历史五', value: 5 },
  { label: '历史六', value: 6 }
]

// 个人事件选项
const personalEventOptions = [
  { label: '个人一', value: 1 },
  { label: '个人二', value: 2 },
  { label: '个人三', value: 3 },
  { label: '个人四', value: 4 },
  { label: '个人五', value: 5 },
  { label: '个人六', value: 6 }
]

// 作品选项
const worksOptions = [
  { label: '作品一', value: 1 },
  { label: '作品二', value: 2 },
  { label: '作品三', value: 3 },
  { label: '作品四', value: 4 },
  { label: '作品五', value: 5 },
  { label: '作品六', value: 6 }
]

export {
  historicalEventOptions,
  personalEventOptions,
  worksOptions,
  summaryData
}