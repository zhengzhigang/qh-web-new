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
    year: 622,
    eventNumber: 36,
    majorEvents: true
  },
  {
    year: 623,
    eventNumber: 44,
    majorEvents: false
  },
  {
    year: 625,
    eventNumber: 44,
    majorEvents: false
  },
  {
    year: 628,
    eventNumber: 24,
    majorEvents: true
  },
  {
    year: 630,
    eventNumber: 44,
    majorEvents: false
  },
  {
    year: 633,
    eventNumber: 44,
    majorEvents: true
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
    year: 638,
    eventNumber: 66,
    majorEvents: false
  },
  {
    year: 640,
    eventNumber: 48,
    majorEvents: true
  },
  {
    year: 642,
    eventNumber: 48,
    majorEvents: false
  },
  {
    year: 645,
    eventNumber: 48,
    majorEvents: false
  },
  {
    year: 647,
    eventNumber: 66,
    majorEvents: true
  },
  {
    year: 650,
    eventNumber: 66,
    majorEvents: true
  },
  {
    year: 652,
    eventNumber: 60,
    majorEvents: false
  },
  {
    year: 658,
    eventNumber: 56,
    majorEvents: false
  },
  {
    year: 660,
    eventNumber: 22,
    majorEvents: true
  },
  {
    year: 664,
    eventNumber: 20,
    majorEvents: false
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
    year: 681,
    eventNumber: 50,
    majorEvents: true
  },
  {
    year: 683,
    eventNumber: 50,
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
    majorEvents: true
  },
  {
    year: 692,
    eventNumber: 44,
    majorEvents: false
  },
  {
    year: 694,
    eventNumber: 44,
    majorEvents: true
  },
  {
    year: 696,
    eventNumber: 34,
    majorEvents: true
  },
  {
    year: 698,
    eventNumber: 34,
    majorEvents: true
  },
  {
    year: 700,
    eventNumber: 34,
    majorEvents: false
  },
  {
    year: 702,
    eventNumber: 34,
    majorEvents: true
  },
  {
    year: 705,
    eventNumber: 34,
    majorEvents: true
  },
  {
    year: 708,
    eventNumber: 66,
    majorEvents: false
  },
  {
    year: 710,
    eventNumber: 22,
    majorEvents: true
  },
  {
    year: 714,
    eventNumber: 40,
    majorEvents: true
  },
  {
    year: 716,
    eventNumber: 40,
    majorEvents: false
  },
  {
    year: 717,
    eventNumber: 40,
    majorEvents: true
  },
  {
    year: 718,
    eventNumber: 40,
    majorEvents: false
  },
  {
    year: 719,
    eventNumber: 40,
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
    year: 626,
    eventNumber: 33,
    majorEvents: false
  },
  {
    year: 628,
    eventNumber: 33,
    majorEvents: true
  },
  {
    year: 630,
    eventNumber: 44,
    majorEvents: false
  },
  {
    year: 633,
    eventNumber: 44,
    majorEvents: false
  },
  {
    year: 635,
    eventNumber: 55,
    majorEvents: true
  },
  {
    year: 637,
    eventNumber: 55,
    majorEvents: false
  },
  {
    year: 638,
    eventNumber: 66,
    majorEvents: true
  },
  {
    year: 641,
    eventNumber: 66,
    majorEvents: true
  },
  {
    year: 643,
    eventNumber: 66,
    majorEvents: false
  },
  {
    year: 645,
    eventNumber: 66,
    majorEvents: true
  },
  {
    year: 648,
    eventNumber: 66,
    majorEvents: true
  },
  {
    year: 650,
    eventNumber: 66,
    majorEvents: true
  },
  {
    year: 653,
    eventNumber: 22,
    majorEvents: false
  },
  {
    year: 657,
    eventNumber: 22,
    majorEvents: true
  },
  {
    year: 660,
    eventNumber: 33,
    majorEvents: false
  },
  {
    year: 665,
    eventNumber: 33,
    majorEvents: false
  },
  {
    year: 671,
    eventNumber: 33,
    majorEvents: true
  },
  {
    year: 674,
    eventNumber: 33,
    majorEvents: false
  },
  {
    year: 680,
    eventNumber: 33,
    majorEvents: false
  },
  {
    year: 684,
    eventNumber: 55,
    majorEvents: true
  },
  {
    year: 690,
    eventNumber: 44,
    majorEvents: false
  },
  {
    year: 695,
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
    year: 713,
    eventNumber: 22,
    majorEvents: false
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
  events: [
    { year: 640, event: '640 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 642, event: '642 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 645, event: '645 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 648, event: '648 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 652, event: '652 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 658, event: '658 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 660, event: '660 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 663, event: '663 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 667, event: '667 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 669, event: '669 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 674, event: '674 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 678, event: '678 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 680, event: '680 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 682, event: '682 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 688, event: '688 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 689, event: '689 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 693, event: '693 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 700, event: '700 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' }
  ],
  relations: [
    {
      name: '杜甫',
      startYear: 628,
      endYear: 660,
      events: [
        { year: 628, number: 1 },
        { year: 632, number: 3 },
        { year: 635, number: 4 },
        { year: 640, number: 5 },
        { year: 642, number: 8 },
        { year: 643, number: 5 },
        { year: 648, number: 20 },
        { year: 650, number: 40 },
        { year: 652, number: 22 },
        { year: 656, number: 10 },
        { year: 660, number: 20 }
      ]
    },
    {
      name: '杜甫',
      startYear: 663,
      endYear: 718,
      events: [
        { year: 663, number: 1 },
        { year: 668, number: 3 },
        { year: 672, number: 4 },
        { year: 676, number: 5 },
        { year: 677, number: 8 },
        { year: 684, number: 5 },
        { year: 688, number: 20 },
        { year: 692, number: 40 },
        { year: 694, number: 22 },
        { year: 695, number: 10 },
        { year: 696, number: 20 },
        { year: 698, number: 3 },
        { year: 702, number: 190 },
        { year: 710, number: 60 },
        { year: 711, number: 24 },
        { year: 712, number: 2 },
        { year: 714, number: 50 },
        { year: 718, number: 30 }
      ]
    },
    {
      name: '杜甫',
      startYear: 656,
      endYear: 720,
      events: [
        { year: 656, number: 1 },
        { year: 662, number: 3 },
        { year: 668, number: 4 },
        { year: 676, number: 5 },
        { year: 684, number: 8 },
        { year: 688, number: 5 },
        { year: 708, number: 20 },
        { year: 712, number: 40 },
        { year: 713, number: 22 },
        { year: 714, number: 10 },
        { year: 715, number: 20 },
        { year: 718, number: 3 },
        { year: 720, number: 190 }
      ]
    },
    {
      name: '杜甫',
      startYear: 632,
      endYear: 702,
      events: [
        { year: 632, number: 1 },
        { year: 639, number: 3 },
        { year: 645, number: 4 },
        { year: 647, number: 5 },
        { year: 656, number: 8 },
        { year: 664, number: 5 },
        { year: 667, number: 20 },
        { year: 669, number: 40 },
        { year: 673, number: 22 },
        { year: 678, number: 10 },
        { year: 684, number: 20 },
        { year: 689, number: 3 },
        { year: 693, number: 190 },
        { year: 694, number: 60 },
        { year: 702, number: 24 }
      ]
    },
    {
      name: '杜甫',
      startYear: 667,
      endYear: 705,
      events: [
        { year: 663, number: 1 },
        { year: 668, number: 3 },
        { year: 672, number: 4 },
        { year: 676, number: 5 },
        { year: 677, number: 8 },
        { year: 684, number: 5 },
        { year: 688, number: 20 },
        { year: 692, number: 40 },
        { year: 694, number: 22 },
        { year: 695, number: 10 },
        { year: 696, number: 20 },
        { year: 698, number: 3 },
        { year: 702, number: 190 },
        { year: 710, number: 60 },
        { year: 711, number: 24 },
        { year: 712, number: 2 },
        { year: 714, number: 50 },
        { year: 718, number: 30 }
      ]
    },
    {
      name: '李白',
      startYear: 680,
      endYear: 715,
      events: [
        { year: 680, number: 1 },
        { year: 684, number: 3 },
        { year: 689, number: 4 },
        { year: 690, number: 5 },
        { year: 694, number: 8 },
        { year: 696, number: 5 },
        { year: 698, number: 20 },
        { year: 703, number: 40 },
        { year: 706, number: 22 },
        { year: 709, number: 10 },
        { year: 710, number: 20 },
        { year: 712, number: 3 },
        { year: 715, number: 190 }
      ]
    },
    {
      name: '李白',
      startYear: 645,
      endYear: 702,
      events: [
        { year: 645, number: 2 },
        { year: 647, number: 30 },
        { year: 660, number: 4 },
        { year: 668, number: 35 },
        { year: 673, number: 8 },
        { year: 680, number: 65 },
        { year: 688, number: 20 },
        { year: 692, number: 40 },
        { year: 694, number: 22 },
        { year: 695, number: 10 },
        { year: 696, number: 20 },
        { year: 698, number: 3 },
        { year: 702, number: 190 }
      ]
    },
    {
      name: '李白',
      startYear: 650,
      endYear: 712,
      events: [
        { year: 650, number: 1 },
        { year: 668, number: 13 },
        { year: 672, number: 4 },
        { year: 676, number: 5 },
        { year: 677, number: 18 },
        { year: 684, number: 50 },
        { year: 688, number: 20 },
        { year: 692, number: 42 },
        { year: 694, number: 22 },
        { year: 695, number: 15 },
        { year: 696, number: 40 },
        { year: 698, number: 3 },
        { year: 702, number: 190 },
        { year: 710, number: 60 },
        { year: 711, number: 24 },
        { year: 712, number: 2 }
      ]
    },
    {
      name: '李白',
      startYear: 628,
      endYear: 668,
      events: [
        { year: 628, number: 1 },
        { year: 638, number: 3 },
        { year: 640, number: 4 },
        { year: 650, number: 5 },
        { year: 655, number: 8 },
        { year: 658, number: 5 },
        { year: 666, number: 20 },
        { year: 668, number: 40 }
      ]
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

// 标尺数据
const rulerData = {
  start: 620,
  end: 720,
  events: [
    { year: 620, event: '620 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 624, event: '624 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 630, event: '630 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 632, event: '632 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 639, event: '639 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 642, event: '642 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 645, event: '645 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 648, event: '648 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 652, event: '652 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 658, event: '658 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 660, event: '660 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 663, event: '663 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 667, event: '667 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 669, event: '669 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 674, event: '674 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 678, event: '678 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 680, event: '680 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 682, event: '682 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 688, event: '688 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 689, event: '689 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 693, event: '693 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 700, event: '700 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 705, event: '705 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 709, event: '709 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 712, event: '712 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 716, event: '716 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' },
    { year: 720, event: '720 后唐明宗长兴四年南汉高祖大有六 年 吴睿帝大和五年闽惠宗龙启元年癸巳' }
  ]
}



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
  filterOptions,
  rulerData
}