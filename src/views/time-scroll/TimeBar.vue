<template>
  <div class="time-bar">
    <div class="time-bar__chart" :id="id ? id : 'timebarChart'" style="width: 100%; height: 536px;"></div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, toRaw } from 'vue'
import * as echarts from 'echarts'

interface Props {
  title: string
  data: any
  id: string
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  title: '各年份事件数',
  data: () => ({})
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
    padding: 10,
    formatter: (params) => {
      const data1 = params[0]
      const data2 = params[1]
      if (data2) {
        return `<div>
          <p style="margin-bottom: 10px;font-size: 18px;font-weight: bold;color: #6D6A63;">${data1.name}</p>
          <p style="font-size: 16px;color: #6D6A63;line-height: 22px;">${props.data.tip1}：${data1.data}</p>
          <p style="font-size: 16px;color: #6D6A63;line-height: 22px;">${props.data.tip2}：${data2.data}</p>
        </div>`
      } else {
        return `<div>
          <p style="margin-bottom: 10px;font-size: 18px;font-weight: bold;color: #6D6A63;">${data1.name}</p>
          <p style="font-size: 16px;color: #6D6A63;line-height: 22px;">${props.data.tip1}：${data1.data}</p>
        </div>`
      }
    }
  },
  yAxis: {
    type: 'value',
    // name: '个',
    nameTextStyle: {
      color: 'rgba(134, 128, 112, 0.6)',
      align: 'right'
    },
    // data: [
    //   0, 20, 40, 60, 80, 100
    // ],
    axisLabel: {
      color: 'rgba(134, 128, 112, 0.6)'
    }
  },
  series: [
    {
      type: 'bar',
      name: 'legend1',
      data: [],
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
    },
    {
      data: [],
      type: 'line',
      name: 'legend2',
      symbol: 'circle',
      // smooth: true,
      symbolSize: 4,
      itemStyle: {
        color: '#709977'
      },
      lineStyle: {
        width: 2,
        color: '#709977'
      },
      connectNulls: true
    }
  ],
  dataZoom: [{
    type: 'slider',
    width: '100%',
    height: '8',
    right: '0%',
    left: '0%',
    // bottom: '0px',
    backgroundColor: '#ddd',//滚到颜色
    handeSize: 0,//手柄
    realtime: true,//实时更新
    //filter过滤掉窗口外的数据，none不过滤数据，只改变数轴范围
    filterMode: 'filter',
    //展示10个柱子
    startValue: 0, //从0个柱子开始，也就是最起始的地方
    endValue: 15, //到第6个柱子结束
    show: true,
    minValueSpan: 10,
    maxValueSpan: 15
  }],
}

const init = () => {
  myEcharts = echarts.init(document.getElementById(props.id || 'timebarChart'))

  myEcharts.setOption(option)
}

const makeData = () => {
  option.title.text = props.title
  option.xAxis.data = props.data.x
  option.series[0].data = props.data.y1
  option.series[1].data = props.data.y2
  init()
}

onMounted(() => {
  // 处理数据
  makeData()
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
