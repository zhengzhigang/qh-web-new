<template>
  <div class="quake-line">
    <div class="quake-line__chart" id="quakeLine" style="width: 100%; height: 536px;"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { getListEarthQuakeNumMonthlyAPi, getListEarthQuakeByMonthAPi } from '@/api/common'

let myEcharts: echarts.ECharts | null = null
const dataList = ref<{ month: string; count: number }[]>([])
// 在 setup 顶部添加
const detailMap = ref<Record<string, any[]>>({}) // key: "2024-05", value: [地震数据数组]

// 图表配置项
const option = {
  title: {
    text: '地震数据',
    left: 17,
    top: 0,
    textStyle: {
      fontSize: 16,
      color: '#6D6A63'
    }
  },
  grid: {
    left: 46,
    right: 46,
    top: 80,
    bottom: 80
  },
  xAxis: {
    type: 'category',
    nameTextStyle: {
      color: 'rgba(134, 128, 112, 0.6)',
      verticalAlign: 'top',
      lineHeight: 28
    },
    data: [] as string[],
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
    triggerOn: 'none',
    padding: 10,
    extraCssText: 'max-height: 300px; overflow-y: auto; max-width: 300px; white-space: normal;pointer-events: auto !important;',
    formatter: (params: any[]) => {
      const param = params[0]
      const monthKey = param.name // 如 "2024-05"
      const dataList = detailMap.value[monthKey] || []

      if (dataList.length === 0) {
        return '<div>加载中...</div>'
      }

      let str = ''
      dataList.forEach((item) => {
        str += `
          <div style="padding: 5px 0;">
            <p>地点：${item.location}</p>
            <p>震级：${item.magnitude}</p>
          </div>
        `
      })

      return `<div>${str}</div>`
    }
  },
  yAxis: {
    type: 'value',
    name: '地震次数',
    nameTextStyle: {
      color: 'rgba(134, 128, 112, 0.6)'
    },
    axisLabel: {
      color: 'rgba(134, 128, 112, 0.6)'
    }
  },
  series: [
    {
      data: [],
      type: 'line',
      name: 'legend2',
      symbol: 'circle',
      yAxisIndex: 0,
      smooth: true,
      symbolSize: 8,
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
    type: 'inside',
    xAxisIndex: 0,
    start: 0,
    end: 20,
    zoomLock: true,
    moveOnMouseWheel: true // ⭐ 关键：启用滚轮平移（ECharts ≥ v5.4）
  },{
    type: 'slider',
    width: '100%',
    height: 8,
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
    endValue: 25, //到第6个柱子结束
    show: true,
    minValueSpan: 10,
    maxValueSpan: 25
  }],
}

// 初始化图表
const initChart = () => {
  const chartDom = document.getElementById('quakeLine')
  if (!chartDom) return

  myEcharts = echarts.init(chartDom)
  myEcharts.setOption(option)

  // 在 initChart 中绑定
  myEcharts.on('click', async (params) => {
    const clickedMonth = option.xAxis.data[params.dataIndex] as string

     // 隐藏 tooltip
    myEcharts.dispatchAction({
      type: 'hideTip'
    });

    await updateTooltipData(clickedMonth, params)
  })
}

// 更新单个点的tooltip信息
const updateTooltipData = async (str: string, params: any) => {
  if (detailMap.value[str]) {
    // 如果已有数据，直接显示 tooltip
    showCustomTooltip(params)
    return
  }

  const [year, month] = str.split('-')

  const res: any = await getListEarthQuakeByMonthAPi({ year, month })
  if (res?.code === 0 && res.data) {
    // 缓存数据
    detailMap.value[str] = res.data
    // 手动显示 tooltip
    const t = setTimeout(() => {
      showCustomTooltip(params)
      clearTimeout(t)
    })
  }
}

const showCustomTooltip = (params: any) => {
  if (myEcharts) {
    myEcharts.dispatchAction({
      type: 'showTip',
      seriesIndex: params.seriesIndex,
      dataIndex: params.dataIndex
    })
  }
}

// 关闭 tooltip
const hideCustomTooltip = () => {
  if (myEcharts) {
    myEcharts.dispatchAction({
      type: 'hideTip'
    })
  }
}

// 合并数据并更新图表
const makeData = () => {
  const months = dataList.value.map(item => item.month)
  const seriesData = dataList.value.map(item => (item.count))

  option.xAxis.data = months
  option.series[0].data = seriesData

  if (myEcharts) {
    myEcharts.setOption(option, true)
  } else {
    initChart()
  }
}

// 获取地震次数（主数据）
const getListEarthQuakeNumMonthly = async () => {
  const res: any = await getListEarthQuakeNumMonthlyAPi()
  if (res?.code === 0) {
    dataList.value = res.data || []
  }
}

// 全局点击事件处理函数
const handleClickOutside = (event: MouseEvent) => {
  const chartContainer = document.querySelector('.quake-line__chart')
  if (chartContainer && !chartContainer.contains(event.target as Node)) {
    hideCustomTooltip()
  }
}

onMounted(async () => {
  await getListEarthQuakeNumMonthly()
  // 处理数据
  makeData()
  // 添加全局点击事件监听器
  window.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  if (myEcharts) {
    myEcharts.dispose()
    myEcharts = null
  }
  // 移除全局点击事件监听器
  window.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
.quake-line {
  display: flex;
  justify-content: space-between;

  &__chart {
    padding: 20px;
    background: #fff;
    border-radius: 4px;
  }
}
</style>
