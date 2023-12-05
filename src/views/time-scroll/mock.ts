// 汇总数据
const summaryData = {
  eventNumber: 12345,
  workNumber: 12345,
  relationNumber: 12345,
  title: '各年份事件数',
  list: [
    { year:618, events:20 },
    { year:636, events:8 },
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

const cardData = {
  xData: [620, 623, 635, 636, 660, 670, 674, 690, 708, 710, 720],
  lineData: [
    { id: "1", value: "33" },
    { id: "2", value: "55" },
    { id: "3", value: "44" },
    { id: "4", value: "66" },
    { id: "5", value: "22" },
    { id: "6", value: "33" },
    { id: "7", value: "55" },
    { id: "8", value: "44" },
    { id: "9", value: "66" },
    { id: "10", value: "22" },
    { id: "11", value: "33" },
  ],
  scatterData: [
    { id: "1", value: "1" },
    { id: "2", value: "0" },
    { id: "3", value: "1" },
    { id: "4", value: "0" },
    { id: "5", value: "1" },
    { id: "6", value: "1" },
    { id: "7", value: "0" },
    { id: "8", value: "1" },
    { id: "9", value: "0" },
    { id: "10", value: "1" },
    { id: "11", value: "1" },
  ]
}

// 人物关系
const relationData = {
  name: '李白',
  startYear: 640,
  endYear: 700,
  relations: [
    {
      name: '杜甫',
      startYear: 628,
      endYear: 660,
    },
    {
      name: '杜甫',
      startYear: 663,
      endYear: 718,
    },
    {
      name: '杜甫',
      startYear: 656,
      endYear: 720,
    },
    {
      name: '杜甫',
      startYear: 632,
      endYear: 702,
    },
    {
      name: '杜甫',
      startYear: 667,
      endYear: 705,
    },
    {
      name: '李白',
      startYear: 680,
      endYear: 715,
    },
    {
      name: '李白',
      startYear: 645,
      endYear: 702,
    },
    {
      name: '李白',
      startYear: 650,
      endYear: 712,
    },
    {
      name: '李白',
      startYear: 628,
      endYear: 668,
    }
  ]
}

// 视角
const angleViewData = [
  { label: '唐代', start: 600, end: 650 },
  { label: '五代', start: 650, end: 660 },
  { label: '十国', start: 660, end: 700 }
]



export {
  historicalEventOptions,
  personalEventOptions,
  worksOptions,
  summaryData,
  cardData,
  relationData,
  angleViewData
}