<template>
  <div class="time-expand">
    <div class="time-expand__left">{{ title }}</div>
    <div class="time-expand__right">
      <div class="time-expand__chart" id="timeExpandChart" style="width: 1095px; height: 265px;"></div>
      <div class="time-expand__expend">
        <img class="time-expand__expend-img" src="../../assets/time-shrink.png" alt="">
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { nextTick, watch, reactive } from 'vue'
import * as echarts from 'echarts'
import { mainStore  } from '@/pinia/main'
const store = mainStore()

interface Props {
  title?: string
  xAxisData: any[]
  yAxisData: any[]

}

const props = withDefaults(defineProps<Props>(), {
  title: '诗类',
  xAxisData: () => [],
  yAxisData: () => []
})

let myEcharts = null
const option = reactive({
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
    data: props.xAxisData,
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
    formatter: '{c}'
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
      data: props.yAxisData,
      itemStyle: {
        color: '#C2B594',
        borderRadius: 4
      },
      barWidth: 8,
      label: {
        show: true,
        position: 'outside',
        fontSize: 14,
        color: '#6D6A63'
      }
    }
  ]
})

const getOptions = () => {
  option.xAxis.data = props.xAxisData
  option.series[0].data = props.yAxisData
  return option
}

const init = () => {
  myEcharts = echarts.init(document.getElementById('timeExpandChart'))
  myEcharts.group = 'group'
  echarts.connect('group')

  myEcharts.setOption(getOptions())
}

// 监听鼠标移动到哪一年
watch(() => store.currentYear, (val) => {
})

watch(() => props.xAxisData, (val) => {
  nextTick(() => {
    init()
  })
}, { immediate: true })
</script>
<style lang="scss" scoped>
.time-expand {
  display: flex;
  justify-content: space-between;
  height: 283px;

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

  &__chart {
    background: #fff;
    border-radius: 4px;
  }
}
</style>
