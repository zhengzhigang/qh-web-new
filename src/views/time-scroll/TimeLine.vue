<template>
  <div class="time-line">
    <div v-if="isShowTab" class="time-line__tabs">
      <span
        v-for="(item, index) in props.tabs"
        :key="index"
        class="time-line__tab"
        :class="{ active: active === item.value }"
        @click="switchTab(item.value)"
      >{{ item.label }}</span>
    </div>
    <div class="time-line__chart" id="timeline" style="width: 100%; height: 536px;"></div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

interface Props {
  isShowTab?: boolean
  tabs?: any
  title: string
  data: any[]
}
let myEcharts = null
const option = {
  title: {
    text: '折线图',
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
    data: [
      618, 628, 638, 648, 658, 668, 678, 688, 698, 708, 718, 728, 738, 748, 758, 768, 778, 798
    ],
    splitLine: {
      show: false
    },
    // x轴字体颜色
    axisLabel: {
      textStyle: {
        color: 'rgba(134, 128, 112, 0.6)',
      },
      formatter: (item,index)=>{
          let a = [618, 636, 638, 668, 678, 698, 708, 738]
          let b = [0, 1, 2, 5, 6, 8, 9, 12]
          for(let i in b){
             if(index===b[i]){
              return a[i]
            }
          }
         return ''
      }
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
    trigger: 'axis'
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
      textStyle: {
        color: 'rgba(134, 128, 112, 0.6)',
      }
    }
  },
  series: [
    {
      data: [],
      type: 'line',
      symbol: 'circle',
      symbolSize: 8,
      itemStyle: {
        normal: {
          color: '#C2B594'
        }
      },
      lineStyle: {
        color: '#C2B594'
      },
      connectNulls: true
    }
  ]
}

const props = withDefaults(defineProps<Props>(), {
  isShowTab: true,
  tabs: [
    { label: '事件信息', value: 1 },
    { label: '作品信息', value: 2 },
    { label: '关系信息', value: 3 }
  ],
  title: '折线图',
  data: []
})
const active = ref(1)

const switchTab = (index) => {
  active.value = index
}

const init = () => {
  myEcharts = echarts.init(document.getElementById('timeline'))

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
.time-line {
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

    &.active,
    &:hover {
      color: #fff;
      background: #6D6A63;
    }
  }
}
</style>
