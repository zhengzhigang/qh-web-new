<template>
  <div class="time-card" :style="{
    background: 'url(' + bg + ') center/100%'
  }">
    <div class="time-card__left" :style="{ background: colors[type] }">{{ props.title }}</div>
    <div class="time-card__right">
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
import { ref, provide, onMounted, computed } from 'vue'
import { getMinMax, getOptions } from './time-util'
import { EChartsOption, DataItem } from './type'

interface Props {
  group?: string
  option?: EChartsOption
  xAxisData: Array<string | number>
  lineData: Array<DataItem>
  scatterData: Array<DataItem>
  title: string
  type: number
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

// 标题颜色
const colors = {
  1: '#A79B7A',
  2: '#007D57',
  3: '#A17400',
  4: '#8C8D27',
  5: '#734D00'
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  group: 'group',
  option: () => ({}),
  style: () => ({}),
  xAxisData: () => [],
  lineData: () => [],
  scatterData: () => [],
  type: 1
});
const emits = defineEmits(['showDetail', 'toggleExpand'])

const minMax = getMinMax(props)

const xAxisData = [
  minMax.minYear - 300,
  ...props.xAxisData,
  minMax.maxYear + 300,
];
const lineData = [undefined, ...props.lineData, undefined];
const scatterData = [{ value: '0' }, ...props.scatterData, { value: '0' }].map(
  (scatter) =>
    `${scatter.value}` === '0'
      ? undefined
      : { ...scatter, value: minMax.maxCount + (minMax.maxCountDiff * 4) / 5 }
);

const chartRef = ref()
const isExpanded = ref(false)
const bg = computed(() => {
  return `@/assets/time-card-bg0${props.type}.png`
})

const option = ref<EChartsOption>({
  ...getOptions({ xAxisData, minMax, lineData, scatterData, color: colors[props.type] }),
  ...props.option,
});

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
  
  &.type1 {
    background: url('../../assets/time-card-bg01.png') center/100%;
  }

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
    background: url("@/assets/time-bg-01.png") center/100%;
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
