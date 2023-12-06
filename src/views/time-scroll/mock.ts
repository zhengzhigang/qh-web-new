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

const cardData1 = [
  {
    year: 620,
    eventNumber: 33,
    majorEvents: true
  },
  {
    year: 623,
    eventNumber: 44,
    majorEvents: false
  },
  {
    year: 635,
    eventNumber: 55,
    majorEvents: false
  },
  {
    year: 636,
    eventNumber: 66,
    majorEvents: false
  },
  {
    year: 660,
    eventNumber: 22,
    majorEvents: true
  },
  {
    year: 670,
    eventNumber: 33,
    majorEvents: true
  },
  {
    year: 674,
    eventNumber: 55,
    majorEvents: false
  },
  {
    year: 690,
    eventNumber: 44,
    majorEvents: true
  },
  {
    year: 708,
    eventNumber: 66,
    majorEvents: true
  },
  {
    year: 710,
    eventNumber: 22,
    majorEvents: true
  },
  {
    year: 720,
    eventNumber: 33,
    majorEvents: false
  },
]

const cardData5 = [
  {
    year: 622,
    eventNumber: 33,
    majorEvents: true
  },
  {
    year: 630,
    eventNumber: 44,
    majorEvents: false
  },
  {
    year: 635,
    eventNumber: 55,
    majorEvents: false
  },
  {
    year: 638,
    eventNumber: 66,
    majorEvents: true
  },
  {
    year: 653,
    eventNumber: 22,
    majorEvents: true
  },
  {
    year: 660,
    eventNumber: 33,
    majorEvents: false
  },
  {
    year: 684,
    eventNumber: 55,
    majorEvents: false
  },
  {
    year: 690,
    eventNumber: 44,
    majorEvents: false
  },
  {
    year: 702,
    eventNumber: 66,
    majorEvents: true
  },
  {
    year: 709,
    eventNumber: 22,
    majorEvents: true
  },
  {
    year: 720,
    eventNumber: 33,
    majorEvents: true
  },
]

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
const angleTabs = [
  { label: '朝代', value: 0 },
  { label: '皇帝', value: 1 },
  { label: '年号', value: 2 }
]
const angleViewData = [
  { label: '唐代', start: 600, end: 650 },
  { label: '五代', start: 650, end: 660 },
  { label: '十国', start: 660, end: 700 }
]
const filterOptions = [
  { label: '选项一', value: 1 },
  { label: '选项二', value: 2 },
  { label: '选项三', value: 3 },
  { label: '选项四', value: 4 },
  { label: '选项五', value: 5 },
  { label: '选项六', value: 6 },
  { label: '选项七', value: 7 },
  { label: '选项八', value: 8 }
]



export {
  historicalEventOptions,
  personalEventOptions,
  worksOptions,
  summaryData,
  cardData1,
  cardData5,
  relationData,
  angleViewData,
  angleTabs,
  filterOptions
}