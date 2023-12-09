<template>
  <div class="time-relation">
    <el-button
      class="time-relation__button"
      type="primary"
      color="#A79B7A"
      @click="showRelation"
    >相关人物</el-button>
    <div
      v-if="isShowRelation"
      class="time-relation__expend"
      @click="showRelation"
    >
      <img class="time-relation__expend-img" src="../../assets/time-shrink.png" alt="">
    </div>
    <!-- 主人公时间轴 -->
    <div
      class="time-relation__axle-main"
      :style="{ width: `${mainWidth}px`, marginBottom: isShowRelation ? '44px' : '24px' }"
    >
      {{ data.name }}({{ data.startYear }}-{{ data.endYear }})
      <!-- 主人公事件tootltip -->
      <el-tooltip
        popper-class="time-relation__tooltip-box"
        ref="mainTooTop"
        placement="top-start"
        effect="light">
        <template #content>
          <div style="max-width: 270px;">{{ mainEventValue }}</div>
        </template>
          <span
            class="time-relation__axle-tooltip"
            :style="{ left: (store.currentYear - props.data.startYear) * space / 2 + 'px' }">
        </span></el-tooltip>
      <div
        v-for="item in (data.endYear - data.startYear)"
        :key="item"
        class="time-relation__axle-mark"
        :style="{
          left: mainWidth / (data.endYear - data.startYear) * item + 'px',
          height: scaleHeight(item, data.endYear - data.startYear)
        }"
      >
        <span
          v-if="scaleHeight(item, data.endYear - data.startYear)"
          class="time-relation__axle-mark-year">{{ item }}</span>
      </div>
    </div>
    <!-- 关联人物时间轴 -->
    <div v-if="isShowRelation">
      <div
        v-for="(item, index) in data.relations"
        :key="index"
        class="time-relation__axle-relation"
        :style="{
          width: `${(item.endYear - item.startYear) / allYear * 100}%`,
          left: `${(item.startYear - start) / allYear * 100}%`
        }"
      >
        {{ item.name }}({{ item.startYear }}-{{ item.endYear }})
        <el-tooltip
          popper-class="time-relation__tooltip-box"
          :ref="(el) => getRelationRef(el, index)"
          placement="top-start"
          effect="light">
          <template #content>
            <div style="max-width: 270px;">{{ relationsEventValue[index] }}</div>
          </template>
            <span
              class="time-relation__axle-tooltip"
              :style="{ left: (store.currentYear - props.data.relations[index].startYear) * space / 2 + 'px' }">
          </span></el-tooltip>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref, watch, nextTick, reactive } from 'vue'
import { mainStore  } from '@/pinia/main'
const store = mainStore()

interface Props {
  data: any
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({})
})
const mainTooTop = ref()
const all = 1052
const start = ref(0)
const end = ref(0)
const isShowRelation = ref(false)
const mainEventValue = ref('')
const mainEventMap = reactive({})
const relationRefs = reactive({})
const relationsEventValue = reactive([])
const relationsMap = reactive([])

// 获取关系任务循环列表ref
const getRelationRef = (el, index) => {
  relationRefs[`relation_0${index}`] = el
}

const allYear = computed(() => {
  return end.value - start.value
})
// 每个刻度间隔px, 每个刻度是2年
const space = computed(() => {
  return Math.floor(all / ((end.value - start.value) / 2))
})
const mainWidth = computed(() => {
  return space.value * (props.data.endYear - props.data.startYear) / 2
})

/**
 * 计算刻度的高度，控制是否可见
 * @param year 当前年龄
 * @param s 开始年龄
 * @param e 结束年龄
 */
const scaleHeight = (curr, years) => {
  // 如果整10结尾，结尾显示数字后移2个，前移2个
  if (years % 10 === 0 && years === curr) {
    return 0
  }
  if ((curr === 2) || (years % 10 === 0 && curr === years - 2)) {
    return '6px'
  }

  if (curr % 10 === 0) {
    return '6px'
  } else {
    return 0
  }
}

const showRelation = () => {
  isShowRelation.value = !isShowRelation.value
}

// 查询主人公当前年份是否有事件，如果有就弹出
const showMainEvent = (year) => {
  if (mainEventMap[year]) {
    mainEventValue.value = mainEventMap[year]
    mainTooTop.value.onOpen()
    mainTooTop.value.updatePopper()
  }
}

const showRelationYear = (year, index) => {
  if (relationsMap[index][year]) {
    relationsEventValue[index] = relationsMap[index][year]
    relationRefs[`relation_0${index}`].onOpen()
    relationRefs[`relation_0${index}`].updatePopper()
  } else {
    const t = setTimeout(() => {
      relationRefs[`relation_0${index}`].onClose()
      clearTimeout(t)
    })
  }
}

const getMainEventMap = () => {
  props.data.events.forEach((item) => {
    mainEventMap[item.year] = item.event
  })

  props.data.relations.forEach((item, index) => {
    const obj = {}
    item.events.forEach((v) => {
      obj[v.year] = v.number
    })
    relationsMap[index] = { ...obj }
  })
}

// 监听鼠标移动到哪一年
watch(() => store.currentYear, (val) => {
  showMainEvent(val)
  if (!isShowRelation.value) return
  relationsMap.forEach((item, index) => {
    showRelationYear(val, index)
  })
})

onMounted(() => {
  start.value = props.data.startYear - 20
  end.value = props.data.endYear + 20

  // 处理数据接口，方便查询，查询的时候不再循环
  getMainEventMap()
})
</script>
<style lang="scss" scoped>
.time-relation {
  position: relative;
  margin: 0 64px 0 58px;

  &__button {
    position: absolute;
    right: 0;
    color: #fff;
  }

  .relation-line {
    height: 18px;
    border-radius: 9px;
    font-size: 14px;
    line-height: 18px;
    text-align: center;
  }

  &__axle {
    &-main {
      position: relative;
      margin-left: auto;
      margin-right: auto;
      background: #734D00;
      color: #FCF9F1;

      @extend .relation-line;

    }
    
    &-mark {
      position: absolute;
      bottom: 0;
      width: 1px;
      background: #CFC2A0;

      &-year {
        position: absolute;
        top: 12px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 14px;
        color: #6D6A63;
      }
    }

    &-relation {
      position: relative;
      margin-bottom: 10px;
      background: #CFC2A0;
      color: #6D6A63;

      @extend .relation-line;
    }

    &-tooltip {
      position: absolute;
      display: block;
      bottom: 6px;
    }
  }

  &__expend {
    position: absolute;
    top: 50%;
    right: -54px;
    margin-top: -15px;
    cursor: pointer;

    &-img {
      width: 20px;
      height: 30px;
    }
  }
}
</style>
<style lang="scss">
.time-relation__tooltip-box {
  .el-popper__arrow {
    display: none;
  }
}
</style>
