<template>
  <div class="time-ruler">
    {{ rulerData.startYear }}
    <div class="time-ruler__main">
      <span
        v-for="(item, index) in Math.ceil((rulerData.end - rulerData.start) / 2)"
        :key="item"
        class="time-ruler__line"
        :style="{ left: `${index * space}px` }"
        :class="{
          long: (index * 2) % 10 === 0,
          bottom: (index / 5) % 2 === 1
        }"
      >
        <span
          class="time-ruler__line-number"
          :class="{ bottom: (index / 5) % 2 === 1 }"
        >
          {{ (index * 2) % 10 === 0 ? (rulerData.start + index * 2) : '' }}
        </span>
      </span>
      <el-tooltip
        popper-class="time-ruler__tooltip-box"
        ref="mainTooTop"
        placement="top-start"
        effect="light">
        <template #content>
          <div style="max-width: 270px;">{{ mainEventValue }}</div>
        </template>
          <span
            class="time-ruler__tooltip"
            :style="{ left: (store.currentYear - rulerData.start) * space / 2 + 'px' }">
        </span></el-tooltip>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, watch, ref, reactive } from 'vue'
import { throttle } from 'lodash-es'
import { mainStore  } from '@/pinia/main'
const store = mainStore()

interface Props {
  lineX: number
  rulerData: any
}

const props = withDefaults(defineProps<Props>(), {
  rulerData: () => ({}),
  lineX: 0
})
// 总共1052px
const all = 1052
const mainTooTop = ref()
const mainEventMap = reactive({})
const mainEventValue = ref('')
// 每个刻度间隔px, 每个刻度是2年
const space = computed(() => {
  return all / ((props.rulerData.end - props.rulerData.start) / 2)
})

// 查询主人公当前年份是否有事件，如果有就弹出
const showMainEvent = (year) => {
  if (mainEventMap[year]) {
    mainEventValue.value = mainEventMap[year]
    mainTooTop.value.onOpen()
    mainTooTop.value.updatePopper()
  }
}

// 计算当前鼠标所属年份
const getCurrentYear = (mouseX) => {
  const base = mouseX - 58
  if (base >= 0) {
    const year = Math.floor(base / space.value * 2 + props.rulerData.start)
    if (year <= props.rulerData.end) {
      store.updateYear(year)
      showMainEvent(year)
    }
  }
}

const throttleGetYear = throttle(getCurrentYear)

const getMainEventMap = () => {
  props.rulerData.events.forEach((item) => {
    mainEventMap[item.year] = item.event
  })
}

watch(() => props.lineX, (v) => {
  throttleGetYear(v)
  getMainEventMap()
})
</script>
<style lang="scss" scoped>
.time-ruler {
  width: 100%;
  height: 61px;
  margin-bottom: 6px;
  background: url('@/assets/time-ruler.png') center/100%;

  &__main {
    position: relative;
    height: 61px;
    margin: 0 64px 0 58px;
  }

  &__line {
    display: block;
    position: absolute;
    top: 1px;
    width: 0;
    height: 10px;
    border-right: 1px solid #CFC4A5;

    &-number {
      position: absolute;
      left: 50%;
      top: 31px;
      line-height: 20px;
      transform: translateX(-50%);
      font-size: 12px;
      color: #CEC1A1;

      &.bottom {
        bottom: 31px;
        top: auto;
      }
    }

    &.long {
      height: 30px;
    }

    &.bottom {
      bottom: 1px;
      top: auto;
    }
  }

  &__tooltip {
    position: absolute;
    display: block;
    bottom: 46px;
  }
}
</style>
<style lang="scss">
.time-ruler__tooltip-box {
  .el-popper__arrow {
    display: none;
  }
}
</style>
