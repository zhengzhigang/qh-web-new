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
        <img class="time-card__expend-img" src="../../assets/time-shrink.png" alt="">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
import { ref, provide, onMounted, computed, toRaw } from 'vue'
import { getMinMax, getOptions } from './time-util'
import { EChartsOption, DataItem } from './type'

interface Props {
  group?: string
  title: string
  type: number
  data: any[]
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
  type: 1
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
const isExpanded = ref(false)
let xAxisData: any[] = []
let yAxisData: any[] = []
let scatterData: any[] = []
// y轴数据连续处理，x轴数据做连续处理
const option = ref<EChartsOption>({})
let minMax: any = null


setTimeout(() => {
  const scatterData2 = [
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
  ].map(
    (scatter) =>
      `${scatter.value}` === '0'
        ? undefined
        : { ...scatter, value: minMax.maxCount + (minMax.maxCountDiff * 4) / 5 }
  );
  console.log('====', scatterData2)
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
    yData.push(item.eventNumber)
    // if (item.majorEvents) {

    // }
    dropData.push({ value: item.majorEvents })
  })
  xAxisData = generateContinuousArray(xData[0], xData[xData.length - 1])
  yAxisData = arrFillNull(xData, yData)
  minMax = getMinMax({ lineData: yData, xAxisData: xData })
  console.log('++++', arrFillNull(xData, dropData))
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
    color: colors[props.type]
  })
  // console.log(toRaw(option.value))
}

const handleClick = (e: any) => {
  if (e.seriesName === 'scatter') {
    emits('showDetail', e.data.id)
  }
};

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
  emits('toggleExpand', isExpanded.value)
}

// TODO 手动触发yooltip
onMounted(() => {
  conductData()
  setOptions()

  setTimeout(() => {
    chartRef.value.dispatchAction({
      type: 'showTip',
      x: 500,
      y: 33,
    });
  }, 3000)
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
