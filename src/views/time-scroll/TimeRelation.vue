<template>
  <div class="time-relation">
    <el-button
      class="time-relation__button"
      type="primary"
      color="#A79B7A"
      @click="showRelation"
    >相关人物</el-button>
    <div
      class="time-relation__axle-main"
      :style="{ width: `${mainWidth}px`, marginBottom: isShowRelation ? '44px' : '24px' }"
    >
      {{ props.dataList.name }}({{ props.dataList.startYear }}-{{ props.dataList.endYear }})
      <div
        v-for="item in (props.dataList.endYear - props.dataList.startYear)"
        :key="item"
        class="time-relation__axle-mark"
        :style="{
          left: mainWidth / (props.dataList.endYear - props.dataList.startYear) * item + 'px',
          height: scaleHeight(item, props.dataList.endYear - props.dataList.startYear)
        }"
      >
        <span
          v-if="scaleHeight(item, props.dataList.endYear - props.dataList.startYear)"
          class="time-relation__axle-mark-year">{{ item }}</span>
      </div>
    </div>
    <div v-if="isShowRelation">
      <div
        v-for="(item, index) in props.dataList.relations"
        :key="index"
        class="time-relation__axle-relation"
        :style="{
          width: `${(item.endYear - item.startYear) / allYear * 100}%`,
          left: `${(item.startYear - start) / allYear * 100}%`
        }"
      >
        {{ item.name }}({{ item.startYear }}-{{ item.endYear }})
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'

interface Props {
  dataList: any
}

const props = withDefaults(defineProps<Props>(), {
  dataList: {
    name: '李白',
    startYear: 640,
    endYear: 700,
    relations: [
      {
        name: '杜甫',
        startYear: 628,
        endYear: 660,
      },
      {
        name: '杜甫',
        startYear: 663,
        endYear: 718,
      },
      {
        name: '杜甫',
        startYear: 656,
        endYear: 720,
      },
      {
        name: '杜甫',
        startYear: 632,
        endYear: 702,
      },
      {
        name: '杜甫',
        startYear: 667,
        endYear: 705,
      },
      {
        name: '李白',
        startYear: 680,
        endYear: 715,
      },
      {
        name: '李白',
        startYear: 645,
        endYear: 702,
      },
      {
        name: '李白',
        startYear: 650,
        endYear: 712,
      },
      {
        name: '李白',
        startYear: 628,
        endYear: 668,
      }
    ]
  }
})
const all = 1052
const start = ref(0)
const end = ref(0)
const isShowRelation = ref(false)
const allYear = computed(() => {
  return end.value - start.value
})
// 每个刻度间隔px, 每个刻度是2年
const space = computed(() => {
  return Math.floor(all / ((end.value - start.value) / 2))
})
const mainWidth = computed(() => {
  return space.value * (props.dataList.endYear - props.dataList.startYear) / 2
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
  isShowRelation.value = true
}

onMounted(() => {
  start.value = props.dataList.startYear - 20
  end.value = props.dataList.endYear + 20
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
  }
}
</style>
