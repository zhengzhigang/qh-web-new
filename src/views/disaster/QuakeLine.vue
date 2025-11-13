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
const detailMap = ref<Record<string, any[]>>({}) 
const pendingRequests = ref<Record<string, boolean>>({})

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
    scale: true,
    nameTextStyle: {
      color: 'rgba(134, 128, 112, 0.6)',
      verticalAlign: 'top',
      lineHeight: 28
    },
    data: [] as string[],
    splitLine: {
      show: false
    },
    axisLabel: {
      color: 'rgba(134, 128, 112, 0.6)',
      interval: 0,
      rotate: 45,
    },
    axisTick: {
      show: false
    },
    axisLine: {
      lineStyle: {
        color: '#EAEAEA',
        width: 0.5
      }
    }
  },
  tooltip: {
    trigger: 'axis',
    triggerOn: 'click',
    padding: 10,
    extraCssText: 'max-height: 300px; overflow-y: auto; max-width: 300px; white-space: normal;pointer-events: auto !important;',
    formatter: (params: any[]) => {
      const param = params[0]
      const monthKey = param.name
      const dataList = detailMap.value[monthKey] || []

      if (dataList.length === 0) {
        return '<div style="padding: 10px;">加载中</div>'
      }

      let str = ''
      dataList.forEach((item) => {
        str += `
          <div style="padding: 5px 0; border-bottom: 1px solid #f0f0f0;">
            <p style="margin: 2px 0;"><strong>地点：</strong>${
              item.location
            }</p>
            <p style="margin: 2px 0;"><strong>时间：</strong>${formatTime(
              item.earthQuakeTime
            )}</p>
            <p style="margin: 2px 0;"><strong>经度：</strong>${
              item.longitude
            }</p>
            <p style="margin: 2px 0;"><strong>纬度：</strong>${
              item.latitude
            }</p>
            <p style="margin: 2px 0;"><strong>震级：</strong>${
              item.magnitude
            }</p>
            <p style="margin: 2px 0;"><strong>震源深度：</strong>${
              item.depth
            }km</p>
          </div>
        `;
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
      symbolSize: 12, // 增大点击区域
      itemStyle: {
        color: '#709977'
      },
      lineStyle: {
        width: 2,
        color: '#709977'
      },
      connectNulls: true,
      // 增加可点击区域
      emphasis: {
        scale: true,
        focus: 'series'
      }
    }
  ],
  dataZoom: [{
    type: 'inside',
    xAxisIndex: 0,
    start: 0,
    end: 10,
    zoomLock: true,
    moveOnMouseWheel: true
  },{
    type: 'slider',
    width: '100%',
    height: 8,
    right: '0%',
    left: '0%',
    backgroundColor: '#ddd',
    handeSize: 0,
    realtime: true,
    filterMode: 'filter',
    startValue: 0,
    endValue: 25,
    show: true,
    minValueSpan: 10,
    maxValueSpan: 25
  }],
}

const formatTime = (arr: number[]) => {
  const [year, month, day, hour, minute, second] = arr;
  return `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")} ${hour ? hour.toString().padStart(2, "0") : "00"}:${
    minute ? minute.toString().padStart(2, "0") : "00"
  }:${second ? second.toString().padStart(2, "0") : "00"}`;
};

// 初始化图表
const initChart = () => {
  const chartDom = document.getElementById('quakeLine')
  if (!chartDom) return

  myEcharts = echarts.init(chartDom)
  myEcharts.setOption(option)

  // 监听整个图表的点击事件，而不仅仅是数据点
  myEcharts.getZr().on('click', async (event) => {
    if (!event.target) {
      // 点击空白区域时，根据坐标判断点击的是哪个数据点
      const pointInPixel = [event.offsetX, event.offsetY]
      
      // 转换坐标到图表坐标系
      const pointInGrid = myEcharts.convertFromPixel('grid', pointInPixel)
      
      if (myEcharts.containPixel('grid', pointInPixel)) {
        const xIndex = Math.round(pointInGrid[0])
        const months = option.xAxis.data as string[]
        
        if (xIndex >= 0 && xIndex < months.length) {
          const clickedMonth = months[xIndex]
          await handleMonthClick(clickedMonth, xIndex)
        }
      }
    }
  })

  // 同时保留原有的数据点点击事件
  myEcharts.on('click', async (params) => {
    if (params.componentType === 'series') {
      const clickedMonth = option.xAxis.data[params.dataIndex] as string
      await handleMonthClick(clickedMonth, params.dataIndex)
    }
  })
}

// 处理月份点击的统一函数
const handleMonthClick = async (month: string, dataIndex: number) => {
  console.log('点击月份:', month)
  
  // 如果已经有数据，直接显示 tooltip
  if (detailMap.value[month]) {
    showTooltip(dataIndex)
    return
  }
  
  // 如果没有数据，先加载数据
  if (!pendingRequests.value[month]) {
    await loadMonthData(month, dataIndex)
  }
}

// 加载月份数据
const loadMonthData = async (month: string, dataIndex: number) => {
  pendingRequests.value[month] = true
  
  try {
    const [year, monthNum] = month.split('-')
    const res: any = await getListEarthQuakeByMonthAPi({ year, month: monthNum })
    
    if (res?.code === 0 && res.data) {
      detailMap.value[month] = res.data
    } else {
      detailMap.value[month] = []
    }

    // 数据加载完成后显示 tooltip
    showTooltip(dataIndex)
    
  } catch (error) {
    console.error('加载地震数据失败:', error)
    detailMap.value[month] = []
    showTooltip(dataIndex)
  } finally {
    pendingRequests.value[month] = false
  }
}

// 显示 tooltip
const showTooltip = (dataIndex: number) => {
  if (!myEcharts) return
  
  // 先隐藏可能已经显示的 tooltip
  myEcharts.dispatchAction({
    type: 'hideTip'
  })
  
  // 短暂延迟后显示 tooltip
  setTimeout(() => {
    if (myEcharts) {
      myEcharts.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: dataIndex
      })
    }
  }, 100)
}

// 合并数据并更新图表
const makeData = () => {
  const months = dataList.value.map(item => item.month)
  const seriesData = dataList.value.map(item => (item.count))

  option.xAxis.data = months
  option.series[0].data = seriesData
  option.dataZoom[0].end = 25 / seriesData.length * 100

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

onMounted(async () => {
  await getListEarthQuakeNumMonthly()
  makeData()
})

onBeforeUnmount(() => {
  if (myEcharts) {
    myEcharts.dispose()
    myEcharts = null
  }
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
    cursor: pointer; // 添加指针样式提示可点击
  }
}
</style>