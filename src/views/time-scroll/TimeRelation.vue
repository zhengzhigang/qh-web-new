<template>
  <div class="time-relation">
    <span class="time-relation__button"
    @click="showRelation"
    >相关人物</span>
    <!-- <el-button
      class="time-relation__button"
      type="primary"
      color="#A79B7A"
      @click="showRelation"
    >相关人物</el-button> -->
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
      {{ person.name }}({{ person.startYear }}-{{ person.endYear }})
      <!-- 主人公事件tootltip -->
      <el-tooltip
        popper-class="time-relation__tooltip-box"
        ref="mainToolTipRef"
        placement="top-start"
        effect="light">
        <template #content>
          <div style="max-width: 270px;">{{ mainEventValue }}</div>
        </template>
          <span
            class="time-relation__axle-tooltip"
            :style="{ left: (store.currentYear - props.person.startYear) * space / 2 + 'px' }">
        </span></el-tooltip>
      <div
        v-for="item in (person.endYear - person.startYear)"
        :key="item"
        class="time-relation__axle-mark"
        :style="{
          left: mainWidth / (person.endYear - person.startYear) * item + 'px',
          height: scaleHeight(item, person.endYear - person.startYear)
        }"
      >
        <span
          v-if="scaleHeight(item, person.endYear - person.startYear)"
          class="time-relation__axle-mark-year">{{ item }}</span>
      </div>
      <span class="time-relation__axle-text">（岁）</span>
    </div>
    <!-- 关联人物时间轴 -->
    <div v-if="isShowRelation" class="time-relation__axle-relation-box">
      <div
        v-for="(item, index) in relations"
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
            <div style="max-width: 270px;">
              {{
                store.currentYear < item.startYear
                  ? 0
                  : store.currentYear > item.endYear
                    ? (item.endYear - item.startYear)
                    : (store.currentYear - item.startYear)
              }}
            </div>
          </template>
            <span
              class="time-relation__axle-tooltip"
              :style="{ left: (store.currentYear - relations[index].startYear) * space / 2 + 'px' }">
          </span></el-tooltip>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref, watch, reactive } from 'vue'
import { mainStore  } from '@/pinia/main'
import { getPersonInfoApi } from '@/api/common'
import JSONBig from 'json-bigint'

const store = mainStore()

interface Props {
  data: any
  personId: any
  person: any
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({}),
  personId: '',
  person: () => ({})
})
const mainToolTipRef = ref()
// 时间轴总宽度
const all = 1052
// 标尺开始时间（主人公出生年-20）
const start = ref(0)
// 标尺结束时间（主人公出生年+20）
const end = ref(0)
// 是否显示关联人物
const isShowRelation = ref(false)
// 当前显示的主人公事件
const mainEventValue = ref('')
// 主人公所有事件合集
const mainEventMap = reactive({})
// 关联人物DOM ref 合集
const relationRefs = reactive({})
// 关联人物数据
const relations = ref([])

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
  return space.value * (props.person.endYear - props.person.startYear) / 2
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
  getPersonInfo()
  isShowRelation.value = !isShowRelation.value
}

// 查询主人公当前年份是否有事件，如果有就弹出
const showMainEvent = (year) => {
  if (mainEventMap[year]) {
    mainEventValue.value = mainEventMap[year]
    mainToolTipRef.value.onOpen()
    mainToolTipRef.value.updatePopper()
  }
}

// 显示关联人物的年龄
const showRelationYearsOld = (year, index) => {
  const startYear = relations.value[index].startYear
  const endYear = relations.value[index].endYear
  if (year < startYear || year > endYear) {
    const t = setTimeout(() => {
      relationRefs[`relation_0${index}`].onClose()
      clearTimeout(t)
    })
  } else {
    relationRefs[`relation_0${index}`].onOpen()
    relationRefs[`relation_0${index}`].updatePopper()
  }
}

const getMainEventMap = () => {
  props.data.events.forEach((item) => {
    mainEventMap[item.year] = item.event
  })
}

// 获取个人时间轴的相关人物的信息
const getPersonInfo = async () => {
  const res: any = await getPersonInfoApi({ bnPersonId: JSONBig.stringify(props.personId) })
  if (res.code === 0) {
    const list = res.data || []
    relations.value = list.map((item) => ({
      name: item.name,
      startYear: item.birthYear,
      endYear: item.deathYear,
      events: []
    }))
  }
}

// 监听鼠标移动到哪一年
watch(() => store.currentYear, (val) => {
  showMainEvent(val)
  if (!isShowRelation.value) return
  relations.value.forEach((item, index) => {
    showRelationYearsOld(val, index)
  })
})

onMounted(() => {
  start.value = props.person.startYear - 20
  end.value = props.person.endYear + 20
  // relations.value = props.data.relations

  // 处理数据接口，方便查询，查询的时候不再循环
  // getMainEventMap()
  getPersonInfo()
})
</script>
<style lang="scss" scoped>
.time-relation {
  position: relative;
  margin: 0 64px 0 58px;

  &__button {
    position: absolute;
    display: block;
    width: 100px;
    height: 35px;
    line-height: 35px;
    right: 0;
    font-size: 16px;
    color: #fff;
    background-color: #A79B7A;
    text-align: center;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #c1b9a2;
    }
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
      background: rgba(207,194,160,0.2);
      color: #6D6A63;

      @extend .relation-line;

      &-box {
        overflow: hidden;
      }
    }

    &-tooltip {
      position: absolute;
      display: block;
      bottom: 6px;
    }

    &-text {
      position: absolute;
      top: 23px;
      right: -38px;
      font-size: 14px;
      color: #6D6A63;
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
  box-shadow: 0px 4px 7px 0px rgba(109,106,99,0.47);

  .el-popper__arrow {
    display: none;
  }
}
</style>
