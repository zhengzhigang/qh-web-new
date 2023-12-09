<template>
  <div class="time-card">
    <div class="time-card__left" :style="{ background: colors[type] }">{{ title }}</div>
    <div class="time-card__right" :class="[[`type${type}`]]">
      <v-chart
        ref="chartRef"
        class="chart"
        :option="option"
        autoresize
        :group="group"
        @click="handleClick"
      />
      <div class="time-card__expend"  @click="toggleExpand">
        <img
          v-show="!isExpanded"
          class="time-card__expend-img"
          src="../../assets/time-shrink.png" alt="">
        <img
          v-show="isExpanded"
          class="time-card__expend-img"
          src="../../assets/time-expand.png" alt="">
      </div>
      <el-tooltip
        popper-class="time-relation__tooltip-box"
        ref="tooltipRef"
        placement="right"
        effect="light">
        <template #content>
          <div style="max-width: 270px;">
            <p>事件名称</p>
            <p>这里是事件概述内容这里是事件概述内容</p>
          </div>
        </template>
          <span
            class="time-relation__axle-tooltip"
            :style="{ position: 'absolute', left: tipX + 5 +'px', top: tipY + 'px' }">
        </span></el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, watch, nextTick } from 'vue'
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
const store = useMainStore()

interface Props {
  group?: string
  title: string
  type: number
  data: any[]
  isShowScatter: boolean
}

use([
  CanvasRenderer,
  LineChart,
  ScatterChart,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  MarkLineComponent,
]);
connect('group')
provide(THEME_KEY, 'light');

const props = withDefaults(defineProps<Props>(), {
  title: '',
  group: 'group',
  data: () => [],
  type: 1,
  isShowScatter: true
});
const emits = defineEmits(['showDetail', 'toggleExpand'])

// 标题颜色
const colors = {
  1: '#A79B7A',
  2: '#007D57',
  3: '#A17400',
  4: '#8C8D27',
  5: '#734D00'
}


const chartRef = ref()
const tooltipRef = ref()
const isExpanded = ref(false)
let xAxisData: any[] = []
let yAxisData: any[] = []
let scatterData: any[] = []
const tipX = ref(0)
const tipY = ref(0)
// y轴数据连续处理，x轴数据做连续处理
const option = ref<EChartsOption>({})
let minMax: any = null

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
    yData.push(item.eventNumber)
    dropData.push({ value: item.majorEvents })
  })
  xAxisData = generateContinuousArray(xData[0], xData[xData.length - 1])
  yAxisData = arrFillNull(xData, yData)
  minMax = getMinMax({ lineData: yData, xAxisData: xData })
  scatterData = arrFillNull(xData, dropData).map((scatter) => {
    return (!scatter || scatter.value) ? null : { value: minMax.maxCount + (minMax.maxCountDiff * 4) / 5 }
  })
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
  chartRef.value.dispatchAction({
    type: 'showTip',
    seriesIndex: 0,
    dataIndex: index
  });
}

const handleClick = (e: any) => {
  const { offsetX, offsetY } = e.event
  console.log(offsetX, offsetY)
  tipX.value = offsetX
  tipY.value = offsetY

  nextTick(() => {
    tooltipRef.value.onOpen()
    tooltipRef.value.updatePopper()
  })
};

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
  emits('toggleExpand', {
    xAxisData,
    yAxisData
  })

  store.updateExpandState({
    val: isExpanded.value,
    type: props.type
  })
}

watch(() => store.isExpandTyoe, (val) => {
  // 如果isExpandTyoe发生了变化，说明展开或者收起了其他轨道
  if (val !== props.type) {
    isExpanded.value = false
  } else {
    isExpanded.value = true
  }
})

watch(() => store.currentYear, (val) => {
  const index = xAxisData.findIndex((item) => item === val)
  if (index > -1) {
    showToolTip(index)
  }
})

onMounted(() => {
  conductData()
  setOptions()
});
</script>

<style scoped lang="scss">
.time-card {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-bottom: 10px;
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
