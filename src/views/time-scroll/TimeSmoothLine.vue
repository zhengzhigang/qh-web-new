<template>
  <div class="time-smooth-line">
    <div class="time-smooth-line__chart" id="timeLineSmooth" style="width: 100%; height: 536px;"></div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { getListYearPostWeightApi } from '@/api/common'

interface Props {
  title: string
  data?: any[]
}
let myEcharts = null
const yearList = ref([])
// 事件列表
const eventList = ref([])
// 作品列表
const postList = ref([])

const option = {
  title: {
    text: '各年份事件/作品数',
    left: 17,
    textStyle: {
      fontSize: 16,
      color: '#6D6A63'
    }
  },
  grid: {
    left: 46,
    right: 46,
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
    axisTick:{
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
    alwaysShowContent: false,
    formatter: (params) => {
      const name = params[0].name
      const eventCnt = params[0].data
      const postCnt = params[1].data
      return `<div>
      <p style="margin-bottom: 10px;font-size: 18px;font-weight: bold;color: #6D6A63;">${name}年</p>
      <p style="font-size: 16px;color: #6D6A63;line-height: 22px;">事件数：${eventCnt}</p>
      <p style="font-size: 16px;color: #6D6A63;line-height: 22px;">作品数：${postCnt}</p>
    </div>`
    }
  },
  yAxis: {
    type: 'value',
    name: '个',
    nameTextStyle: {
      color: 'rgba(134, 128, 112, 0.6)',
      align: 'right'
    },
    data: [],
    axisLabel: {
      color: 'rgba(134, 128, 112, 0.6)'
    }
  },
  series: [
    {
      data: [],
      type: 'line',
      symbol: 'circle',
      smooth: true,
      symbolSize: 10,
      itemStyle: {
        color: '#C2B594'
      },
      lineStyle: {
        width: 4,
        color: '#C2B594'
      },
      connectNulls: true
    },
    {
      data: [],
      type: 'line',
      symbol: 'circle',
      smooth: true,
      symbolSize: 10,
      itemStyle: {
        color: '#709977'
      },
      lineStyle: {
        width: 4,
        color: '#709977'
      },
      connectNulls: true
    }
  ]
}

const props = withDefaults(defineProps<Props>(), {
  title: '折线图',
  data: () => []
})

const init = () => {
  myEcharts = echarts.init(document.getElementById('timeLineSmooth'))

  myEcharts.setOption(option)
}

const setData = () => {
  option.title.text = props.title
  option.xAxis.data = [...yearList.value]
  option.series[0].data = eventList.value
  option.series[1].data = postList.value

  init()
}

const getData = async () => {
  const res: any = await getListYearPostWeightApi()
  if (res.code === 0) {
    const data = res.data || {}
    yearList.value = data.yearEventWeightVOList.map((item) => item.year)
    eventList.value = data.yearEventWeightVOList.map((item) => item.cnt)
    postList.value = data.yearPostWeightVOList.map((item) => item.cnt)
    setData()
  }
}

onMounted(() => {
  getData()
})
</script>
<style lang="scss" scoped>
.time-smooth-line {
  &__chart {
    padding-top: 22px;
    background: #fff;
    border-radius: 4px;
  }

  &__tabs {
    padding: 51px 0 18px;
    font-size: 0;
  }

  &__tab {
    display: inline-block;
    width: 122px;
    height: 40px;
    margin-right: 3px;
    text-align: center;
    line-height: 40px;
    border: 1px solid #6D6A63;
    font-size: 16px;
    color: #6D6A63;
    cursor: pointer;
    border-radius: 4px;
    background: #FCF9F1;

    &.active,
    &:hover {
      color: #fff;
      background: #6D6A63;
    }
  }
}
</style>
