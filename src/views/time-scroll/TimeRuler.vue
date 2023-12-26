<template>
  <div class="time-ruler">
    <div class="time-ruler__main">
      <span
        v-for="(item, index) in Math.ceil((data.end - data.start) / scale)"
        :key="item"
        class="time-ruler__line"
        :style="{ left: `${index * space}px` }"
        :class="{
          long: scale === 1? indexToyear(index) % 5 === 0 : index % 5 === 0,
          bottom: scale === 1 ? Math.floor(indexToyear(index) / 5) % 2 === 0 : Math.floor(index / 5) % 2 === 0
        }"
      >
        <span v-if="scale === 1 || index % 5 === 0" class="time-ruler__line-number">
          {{ indexToyear(index) % scale * 5 === 0 ? indexToyear(index) : '' }}
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
            :style="{ left: (store.currentYear - data.start) * space / scale + 'px' }">
        </span>
      </el-tooltip>
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
  data: any
  scale: number
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({}),
  lineX: 0,
  scale: 2
})
// 总共1052px
const all = 1052
const mainTooTop = ref()
const mainEventMap = reactive({})
const mainEventValue = ref('')
// 每个刻度间隔px, 每个刻度是scale年
const space = computed(() => {
  return all / ((props.data.end - props.data.start) / props.scale)
})

const indexToyear = (index) => {
  return props.data.start + index * props.scale
}

// 查询主人公当前年份是否有事件，如果有就弹出
const showMainEvent = (year) => {
  if (mainEventMap[year]) {
    mainEventValue.value = mainEventMap[year]
    mainTooTop.value.onOpen()
    mainTooTop.value.updatePopper()
  }
}

// 计算当前鼠标所在位置对应的年份
const getCurrentYear = (mouseX) => {
  const base = mouseX - 58
  const start = props.data.start
  if (base >= 0) {
    const year = Math.floor(base / space.value * props.scale + start)
    if (year <= props.data.end) {
      store.updateYear(year)
      showMainEvent(year)
    }
  }
}

const throttleGetYear = throttle(getCurrentYear, 200)

const getMainEventMap = () => {
  props.data.events.forEach((item) => {
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
      top: 11px;
      line-height: 20px;
      transform: translateX(-50%);
      font-size: 12px;
      color: #CEC1A1;
    }

    &.long {
      height: 30px;

      .time-ruler__line-number {
        top: 31px;
      }
    }

    &.bottom {
      bottom: 1px;
      top: auto;
    }

    &.bottom .time-ruler__line-number {
      bottom: 11px;
      top: auto;
    }

    &.long.bottom .time-ruler__line-number {
      bottom: 31px;
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
  box-shadow: 0px 4px 7px 0px rgba(109,106,99,0.47);

  .el-popper__arrow {
    display: none;
  }
}
</style>
