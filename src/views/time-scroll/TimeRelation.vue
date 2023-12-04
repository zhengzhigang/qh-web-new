<template>
  <div class="time-relation">
    <el-button class="time-relation__button" type="primary" color="#A79B7A">相关人物</el-button>
    <div
      class="time-relation__axle-main"
      :style="{ width: `${mainWidth}px` }"
    >
      {{ props.dataList.name }}({{ props.dataList.startYear }}-{{ props.dataList.endYear }})
    </div>
    <div>
      <div
        v-for="(item, index) in props.dataList.relations"
        :key="index"
        class="time-relation__axle-relation"
        :style="{
          width: `${(item.endYear - item.startYear) / allYear * 100}%`,
          left: `${(item.startYear - start) / allYear * 100}%`
        }"
      >
      {{ item.startYear  }}=={{ start }}

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
    endYear: 702,
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
        endYear: 721,
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
const allYear = computed(() => {
  return end.value - start.value
})
// 每个刻度间隔px, 每个刻度是2年
const space = computed(() => {
  return Math.floor(all / ((props.dataList.endYear - props.dataList.startYear) / 2))
})
const mainWidth = computed(() => {
  return space.value * (end.value - start.value) / 2
})

onMounted(() => {
  start.value = props.dataList.startYear - 20
  end.value = props.dataList.endYear + 20
})
</script>
<style lang="scss" scoped>
.time-relation {
  margin: 0 64px 0 5;
  position: relative;

  &__axle {
    &-main {
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 44px;
      height: 18px;
      background: #734D00;
      border-radius: 9px;
      font-size: 14px;
      color: #FCF9F1;
      text-align: center;
    }

    &-relation {
      position: relative;
      height: 18px;
      margin-bottom: 10px;
      border-radius: 9px;
      background: #CFC2A0;
      font-size: 14px;
      color: #6D6A63;
      text-align: center;
    }
  }
}
</style>
