<template>
  <div class="time-wordcloud">
    <p class="time-wordcloud__title">云词条</p>
    <div id="timeWordcloud" class="time-wordcloud__content"></div>
  </div>
</template>
<script lang="ts" setup>
import * as echarts from 'echarts'
import 'echarts-wordcloud'
import { onMounted, ref } from "vue"
import { getlandPageApi } from '@/api/common'

const cloudData = ref([])

const option = {
  title: {
    text: '关键词',
    show: false
  },
  tooltip: {
    padding: 10,
    formatter: (params) => {
      const data = params.data
      return `<div>
      <p style="margin-bottom: 10px;font-size: 18px;font-weight: bold;color: #6D6A63;">${data.name}</p>
      <p style="font-size: 16px;color: #6D6A63;line-height: 22px;">事件数：${data.eventCnt}</p>
      <p style="font-size: 16px;color: #6D6A63;line-height: 22px;">作品数：${data.postCnt}</p>
    </div>`
    }
  },
  series: [{
    type: 'wordCloud',
    /**
     * 绘制词云的形状, 值为回调函数 或 关键字, 默认 circle
     *  关键字:
     * 
     * circle（圆形）  词的数量不太多的时候，效果不明显，它会趋向于画一个椭圆
     * cardioid（苹果形或心形曲线）
     * diamond（菱形 正方形）
     * triangle-forward（三角形-向前）
     * triangle（三角形-直立）
     * pentagon（五边形）
     * star（星形）
     */
    shape: 'circle',
    // 保持 maskImage 的纵横比或形状的纵横比为 1：1
    keepAspect: false,
    // 词云文本大小范围,  默认为最小16像素，最大36像素
    sizeRange: [16, 36],
    rotationRange: [0, 0],
    rotationStep: 0,
    left: 'center',
    top: 'center',
    width: '100%',
    height: '100%',
    right: null,
    bottom: null,
    gridSize: 8,
    drawOutOfBound: false,
    // layoutAnimation: true,
    // 这是全局的文字样式，相对应的还可以对每个词设置字体样式
    textStyle: {
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
      // 颜色可以用一个函数来返回字符串
      color: function () {
        // Random color
        return 'rgb(' + [
          Math.round(Math.random() * 160),
          Math.round(Math.random() * 160),
          Math.round(Math.random() * 160)
        ].join(',') + ')';
      },
      emphasis: {
      focus: 'self',
      textStyle: {
        textShadowBlur: 10,
        textShadowColor: '#999'
      }
    },
    },
    // Data is an array. Each array item must have name and value property.
    data: []
  }]
}
 
const drawWordCloud = () => {
  option.series[0].data = cloudData.value
	// 词云
	let mychart = echarts.init(document.getElementById("timeWordcloud")) // 可以设置主题色'dark'
	mychart.setOption(option)
}

const getData = async () => {
  const res: any = await getlandPageApi()
  if (res.code === 0) {
    const data = res.data || []
    cloudData.value = data.map((item) => ({
      name: item.userName,
      value: item.totalCnt,
      postCnt: item.postCnt,
      eventCnt: item.eventCnt
    }))
	  drawWordCloud()
  }
}
 
onMounted(() => {
  getData()
})
</script>
<style lang="scss" scoped>
.time-wordcloud {
  width: 588px;
  height: 536px;
  padding: 0 26px;
  box-sizing: border-box;
  background: #fff;
  border-radius: 4px;

  &__title {
    font-size: 16px;
    font-family: Microsoft YaHei;
    color: #6D6A63;
    line-height: 54px;
  }

  &__content {
    width: 536px;
    height: 447px;
    background: #F5F3EC;
    border-radius: 4px;
  }
}
</style>