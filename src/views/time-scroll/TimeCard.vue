<template>
  <div class="time-card" :style="{ height: `${isExpanded ? 283 : 80}px` }">
    <div class="time-card__left" :style="{ background: colors[type] }">{{ title }}</div>
    <div class="time-card__right" :class="[[`type${type}`]]">
      <v-chart
        v-if="!isExpanded"
        ref="chartRef"
        class="chart"
        :option="option"
        autoresize
        :group="group"
        @click="handleClick"
        @mouseout="handleMouseout"
      />
      <div v-else class="time-card__expand-chart" ref="expandChartRef" style="width: 1095px; height: 265px;"></div>

      <div class="time-card__expend"  @click="toggleExpand">
        <img
          v-show="isExpanded"
          class="time-card__expend-img"
          src="../../assets/time-shrink.png" alt="">
        <img
          v-show="!isExpanded"
          class="time-card__expend-img"
          src="../../assets/time-expand.png" alt="">
      </div>
      <el-tooltip
        popper-class="time-card__tooltip-box"
        ref="tooltipRef"
        placement="right"
        effect="light">
        <template #content>
          <div v-for="(item, index) in currentEvent" style="max-width: 270px;">
            <p class="time-card__tooltip-box-title">{{ item.eventName }}</p>
            <p class="time-card__tooltip-box-desc">{{ item.eventDesc }}</p>
          </div>
        </template>
          <span
            class="time-card__axle-tooltip"
            :style="{ position: 'absolute', left: tipX + 5 +'px', top: tipY + 'px' }">
        </span></el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, watch, nextTick, reactive } from 'vue'
import { use, connect } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, ScatterChart } from 'echarts/charts'
import {
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  MarkLineComponent,
} from "echarts/components"
import VChart, { THEME_KEY } from "vue-echarts"
import { getMinMax, getOptions } from './time-util'
import { EChartsOption } from './type'
import { mainStore as useMainStore } from '@/pinia/main'
import * as echarts from 'echarts'
import { getImportantEventApi, getPersonImportantEventApi, getIndividualImportantEventApi } from '@/api/common'
import JSONBig from 'json-bigint';

const store = useMainStore()

interface Props {
  group?: string
  title: string
  type: number
  data: any[]
  importantList: any[]
  isShowScatter?: boolean
  tabIndex: number
  personId: any
}

use([
  CanvasRenderer,
  LineChart,
  ScatterChart,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  MarkLineComponent,
])
connect('group')
provide(THEME_KEY, 'light')

const props = withDefaults(defineProps<Props>(), {
  title: '',
  group: 'group',
  data: () => [],
  importantList: () => [],
  type: 1,
  isShowScatter: true,
  tabIndex: 0,
  personId: ''
})
const emits = defineEmits(['showDetail', 'toggleExpand'])

// 标题颜色
const colors = {
  1: '#A79B7A',
  2: '#007D57',
  3: '#A17400',
  4: '#8C8D27',
  5: '#734D00',
  6: '#A79B7A',
  7: '#007D57',
  8: '#A17400',
  9: '#8C8D27',
  10: '#734D00'
}

const chartRef = ref()
const expandChartRef = ref()
const tooltipRef = ref()
const isExpanded = ref(false)
let xAxisData: any[] = []
let yAxisData: any[] = []
let scatterData: any[] = []
const tipX = ref(0)
const tipY = ref(0)
const currentEvent = ref([])
// 当前点击的重大事件名
const currentEventName = ref('')
// 当前点击的重大事件描述
const currentEventDesc = ref('')
// y轴数据连续处理，x轴数据做连续处理
const option = ref<EChartsOption>({})
let minMax: any = null
let expandEcharts = null
const expandOption = reactive({
  grid: {
    left: 46,
    right: 46,
    top: 46
  },
  xAxis: {
    type: 'category',
    name: '年',
    nameTextStyle: {
      color: 'rgba(134, 128, 112, 0.6)',
      verticalAlign: 'top',
      lineHeight: 28
    },
    data: xAxisData,
    splitLine: {
      show: false
    },
    // x轴字体颜色
    axisLabel: {
      color: 'rgba(134, 128, 112, 0.6)'
    },
    // x轴刻度
    axisTick: {
      show: false
    },
    // x轴线
    axisLine: {
      lineStyle: {
        color: '#EAEAEA',
        width: 0.5
      }
    }
  },
  tooltip: {
    trigger: 'axis',
    formatter: '{c}',
    transitionDuration: 0
  },
  yAxis: {
    type: 'value',
    name: '个',
    nameTextStyle: {
      color: 'rgba(134, 128, 112, 0.6)',
      align: 'right'
    },
    data: [
      0, 20, 40, 60, 80, 100
    ],
    axisLabel: {
      color: 'rgba(134, 128, 112, 0.6)'
    }
  },
  series: [
    {
      type: 'bar',
      data: yAxisData,
      itemStyle: {
        color: '#C2B594',
        borderRadius: 4
      },
      barWidth: 8,
      label: {
        show: true,
        position: 'top',
        fontSize: 14,
        color: '#6D6A63'
      }
    }
  ]
})

// 数据补空处理
const arrFillNull = (tmpl, list) => {
  let newList = []
  for (let i = 0; i < tmpl.length; i++) {
    const current = tmpl[i]
    let next = tmpl[i + 1]
    newList.push(list[i])
    if (next) {
      let diff = next - current
      if (diff > 1) {
        const newArr = new Array(diff - 1).fill(null)
        newList.push(...newArr)
      }
    }
  }
  return newList
}

// 数据连续处理
const generateContinuousArray = (start, end) => {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

// 处理数据
const conductData = () => {
  let xData = []
  let yData = []
  let dropData = []
  props.data.forEach(item => {
    xData.push(item.year)
    yData.push(item.cnt)
  })
  xAxisData = generateContinuousArray(xData[0], xData[xData.length - 1])
  yAxisData = arrFillNull(xData, yData)
  minMax = getMinMax({ lineData: yData, xAxisData: xData })
  xAxisData.forEach((item) => {
    const val = props.importantList.find((curr) => curr.year === item)
    if (val) {
      dropData.push({ value: minMax.maxCount + (minMax.maxCountDiff * 4) / 5, year: item })
    } else {
      dropData.push(null)
    }
  })
  scatterData = dropData
}

// 设置option
const setOptions = () => {
  option.value = getOptions({
    xAxisData: xAxisData,
    minMax,
    lineData: yAxisData,
    scatterData: scatterData,
    color: colors[props.type],
    isShowScatter: props.isShowScatter
  })
}

const showToolTip = (index) => {
  const data = {
    type: 'showTip',
    seriesIndex: 0,
    dataIndex: index
  }
  if (isExpanded.value) {
    expandEcharts.dispatchAction(data)
  } else {
    chartRef.value.dispatchAction(data)
  }
}

const handleClick = (e: any) => {
  const { offsetX, offsetY } = e.event
  tipX.value = offsetX
  tipY.value = offsetY
  if (e.seriesName !== 'scatter') return
  if (props.tabIndex === 0) {
    // 历史时间轴
    getInportantEvents(e.data.year)
  } else {
    if (props.type === 5) {
      getIndividualImportantEvent(e.data.year)
      return
    }
    getPersonImportantEvent(e.data.year)
  }
}

const handleMouseout = (e) => {
  if (e.seriesName !== 'scatter') return
  tooltipRef.value.onClose()
}

// 查找数组中与当前鼠标所在年份相邻的年份
const getSiblingYear = (year) => {
  let diff = 9999999
  let index = 0
  for (let i = 0; i < xAxisData.length; i++) {
    if (Math.abs(year - xAxisData[i]) < diff && yAxisData[i] !== null) {
      diff = Math.abs(year - xAxisData[i])
      index = i
    } else {
      continue
    }
  }
  return index
}

// 获取历史时间轴重要事件
const getInportantEvents = async (year = 0) => {
  const res: any = await getImportantEventApi({
    year,
    eventType: props.title
  })
  if (res.code === 0) {
    if (res.data && res.data.length) {
      const event = res.data || []
      currentEvent.value = event
      currentEventName.value = event.eventName
      currentEventDesc.value = event.eventDesc
      nextTick(() => {
        tooltipRef.value.onOpen()
        tooltipRef.value.updatePopper()
      })
    }
  }
}

// 获取个人时间轴重要事件
const getPersonImportantEvent = async (year = 0) => {
  const res: any = await getPersonImportantEventApi({
    year,
    eventType: props.title,
    bnPersonId: JSONBig.stringify(props.personId)
  })
  if (res.code === 0) {
    if (res.data && res.data.length) {
      const event = res.data || []
      currentEvent.value = event
      currentEventName.value = event.eventName
      currentEventDesc.value = event.eventDesc
      nextTick(() => {
        tooltipRef.value.onOpen()
        tooltipRef.value.updatePopper()
      })
    }
  }
}

// 获取个人时间轴的人物经历的重要事件
const getIndividualImportantEvent = async (year = 0) => {
  const res: any = await getIndividualImportantEventApi({
    year,
    eventType: props.title,
    bnPersonId: JSONBig.stringify(props.personId)
  })
  if (res.code === 0) {
    if (res.data && res.data.length) {
      const event = res.data || []
      currentEvent.value = event
      currentEventName.value = event.eventName
      currentEventDesc.value = event.eventDesc
      nextTick(() => {
        tooltipRef.value.onOpen()
        tooltipRef.value.updatePopper()
      })
    }
  }
}

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
  nextTick(() => {
    if (isExpanded.value) {
      // 展开
      initExpand()
    } else {
      // 收起
      setOptions()
    }
  })
  emits('toggleExpand', {
    xAxisData,
    yAxisData
  })

  store.updateExpandState({
    val: isExpanded.value,
    type: props.type
  })
}

const getExpandOptions = () => {
  expandOption.xAxis.data = xAxisData
  expandOption.series[0].data = yAxisData
  return expandOption
}

const initExpand = () => {
  expandEcharts = echarts.init(expandChartRef.value)
  expandEcharts.group = 'group'
  echarts.connect('group')

  expandEcharts.setOption(getExpandOptions())
}

watch(() => store.isExpandType, (val) => {
  // 如果isExpandType发生了变化，说明展开或者收起了其他轨道
  if (val !== props.type) {
    isExpanded.value = false
  } else {
    isExpanded.value = true
  }
})

watch(() => store.currentYear, (val) => {
  const index = xAxisData.findIndex((item) => item === val)
  if (index > -1 && yAxisData[index] !== null) {
    showToolTip(index)
  } else {
    // 如果没有找到，就查找附近的
    showToolTip(getSiblingYear(val))
  }
})

onMounted(() => {
  conductData()
  setOptions()
})
</script>

<style scoped lang="scss">
.time-card {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-bottom: 1px;
  width: 100%;
  height: 80px;

  &__left {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    width: 28px;
    margin-right: 3px;
    background: #734D00;
    font-size: 14px;
    color: #fff;
    writing-mode: vertical-rl;
  }

  &__right {
    position: relative;
    flex: 1;
    padding: 9px 39px 0 9px;

    &.type1 {
      background: url('../../assets/time-card-bg01.png') center/100%;
    }

    &.type2 {
      background: url('../../assets/time-card-bg02.png') center/100%;
    }

    &.type3 {
      background: url('../../assets/time-card-bg03.png') center/100%;
    }

    &.type4 {
      background: url('../../assets/time-card-bg04.png') center/100%;
    }

    &.type5 {
      background: url('../../assets/time-card-bg05.png') center/100%;
    }

    &.type6 {
      background: url('../../assets/time-card-bg01.png') center/100%;
    }

    &.type7 {
      background: url('../../assets/time-card-bg02.png') center/100%;
    }

    &.type8 {
      background: url('../../assets/time-card-bg03.png') center/100%;
    }

    &.type9 {
      background: url('../../assets/time-card-bg04.png') center/100%;
    }

    &.type10 {
      background: url('../../assets/time-card-bg05.png') center/100%;
    }
  }

  &__expend {
    position: absolute;
    top: 50%;
    right: 10px;
    margin-top: -15px;
    cursor: pointer;

    &-img {
      width: 20px;
      height: 30px;
    }
  }

  &__expand-chart {
    background: #fff;
    border-radius: 4px;
  }
}
.chart-wrap {
}

.chart-wrap .expand {
  position: absolute;
  top: 50%;
  right: 10px;
  margin-top: -15px;
  cursor: pointer;
  z-index: 1;
}

.time-expand__expend-img {
    width: 20px;
    height: 30px;
}

.chart-wrap .expand-up,
.chart-wrap .expand-down {
  width: 20px;
  height: 20px;
  background-color: #a3aebc;
  color: #fff;
  cursor: pointer;
}
</style>
<style lang="scss">
.time-card__tooltip-box {
  box-shadow: 0px 4px 7px 0px rgba(109,106,99,0.47);

  .el-popper__arrow {
    display: none;
  }

  &-title {
    font-size: 14px;
    font-family: Microsoft YaHei;
    color: #6D6A63;
    line-height: 24px;
  }

  &-desc {
    font-size: 14px;
    font-family: Microsoft YaHei;
    color: #6D6A63;
    opacity: 0.5;
  }
}
</style>
