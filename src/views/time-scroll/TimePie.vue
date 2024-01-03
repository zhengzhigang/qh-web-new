<template>
  <div class="time-pie">
    <div class="time-line__chart" id="timePie" style="width: 100%; height: 536px;"></div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { getTotalCountAndPercentApi } from '@/api/common'
import JSONBig from 'json-bigint'

interface Props {
  title?: string
  data?: any[]
}
let myEcharts = null
const colors = ['#FAE9BC', '#C5AE75', '#A17400', '#8C8D27', '#5E4004', '#709977']

const pieData = ref([])

const option = {
  title: {
    text: '已编年作品',
    left: 17,
    top: 20,
    textStyle: {
      fontSize: 16,
      color: '#6D6A63'
    }
  },
  tooltip: {
    show: false,
    trigger: 'item'
  },
  legend: {
    top: 70,
    left: 'center',
    width: 400,
    itemGap: 15,
    icon: 'circle'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      top: 90,
      minAngle: 15,
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      label: {
        formatter: '{name|{b}}\n{hr|}\n{percent|{c}%}',
        padding: [1, 0, 0, 0],
        rich: {
          hr: {
            backgroundColor: 'auto',
            borderRadius: 7,
            width: 7,
            height: 7,
            padding: [0, -7],
          },
          name: {
            fontSize: 12,
            color: '#6D6A63',
            padding: [0, 7, 4, 7]
          },
          percent: {
            fontSize: 14,
            fontWeight: 'bold',
            color: '#6D6A63',
            padding: [4, 7, 0, 7]
          }
        }
      },
      labelLine: {
        show: true, // 显示引导线
        length2: 80, // 引导线长度（相对于标签文字大小）
        lineStyle: {
          color: '#6D6A63' // 引导线颜色
        },
        symbolSize: 50, // 圆点大小
        itemStyle: {
          borderColor: '#fff', // 圆点边框颜色
          borderWidth: 1 // 圆点边框宽度
        }
      }
    }
  ]
}

const props = withDefaults(defineProps<Props>(), {
  title: '折线图',
  data: () => []
})
const active = ref(1)

const switchTab = (index) => {
  active.value = index
}

const init = () => {
  myEcharts = echarts.init(document.getElementById('timePie'))

  myEcharts.setOption(option)
}

const getData = async () => {
  const res: any = await getTotalCountAndPercentApi()
  if (res.code=== 0) {
    const data = res.data || []
    pieData.value = data.map((item, index) => ({
      value: Number(JSONBig.stringify(item.percent)).toFixed(2),
      name: item.postProduceType,
      itemStyle: { color: colors[index] }
    }))
    option.series[0].data = [...pieData.value]
    init()
  }
}

onMounted(() => {
  getData()
})
</script>
<style lang="scss" scoped>
.time-pie {
  background: #fff;
  border-radius: 4px;

  &__chart {
    padding-top: 22px;
    background: #fff;
    border-radius: 4px;
  }
}
</style>
