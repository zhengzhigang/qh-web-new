<template>
  <div class="time-bar">
    <div class="time-bar__chart" id="timebarChart" style="width: 100%; height: 536px;"></div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import * as echarts from 'echarts'

interface Props {
  title: string
  data: any[]
}

const props = withDefaults(defineProps<Props>(), {
  title: '各年份事件数',
  data: () => []
})

let myEcharts = null
const option = {
  title: {
    text: '各年份事件数',
    left: 17,
    textStyle: {
      fontSize: 16,
      color: '#6D6A63'
    }
  },
  grid: {
    left: 46,
    right: 46
  },
  xAxis: {
    // show: false,
    type: 'category',
    name: '年',
    nameTextStyle: {
      color: 'rgba(134, 128, 112, 0.6)',
      verticalAlign: 'top',
      lineHeight: 28
    },
    data: [],
    splitLine: {
      show: false
    },
    // x轴字体颜色
    axisLabel: {
      textStyle: {
        color: 'rgba(134, 128, 112, 0.6)',
      }
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
    trigger: 'axis'
  },
  yAxis: {
    type: 'value',
    name: '个',
    nameTextStyle: {
      color: 'rgba(134, 128, 112, 0.6)',
      align: 'right'
    },
    // data: [
    //   0, 20, 40, 60, 80, 100
    // ],
    axisLabel: {
      textStyle: {
        color: 'rgba(134, 128, 112, 0.6)',
      }
    }
  },
  series: [
    {
      type: 'bar',
      data: [],
      itemStyle: {
        color: '#C2B594',
        barBorderRadius: 4
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
}

const init = () => {
  myEcharts = echarts.init(document.getElementById('timebarChart'))

  myEcharts.setOption(option)
}

onMounted(() => {
  option.title.text = props.title
  option.series[0].data = props.data.map((item) => item.events)
  option.xAxis.data = props.data.map((item) => item.year)
  init()
})
</script>
<style lang="scss" scoped>
.time-bar {
  display: flex;
  justify-content: space-between;

  &__chart {
    padding-top: 22px;
    background: #fff;
    border-radius: 4px;
  }
}
</style>
