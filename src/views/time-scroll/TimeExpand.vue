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
import { onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import { mainStore  } from '@/pinia/main'
const store = mainStore()

interface Props {
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: '诗类'
})

let myEcharts = null
const option = {
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
      type: 'bar',
      data: [20, 8, 50, 55, 20, 47, 28, 66, 80, 55, 37, 50, 67, 23, 20, 47, 30],
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
  myEcharts = echarts.init(document.getElementById('timeExpandChart'))

  myEcharts.setOption(option)
}

// 监听鼠标移动到哪一年
watch(() => store.currentYear, (val) => {
  console.log('===', val)
})

onMounted(() => {
  init()
})
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
