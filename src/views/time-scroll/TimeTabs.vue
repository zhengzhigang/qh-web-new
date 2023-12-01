<template>
  <div class="time-tabs">
    <div
      class="time-tabs__item"
      :class="{ active: tabIndex === 0 }"
      @click="switchTab(0)"
    >
      历史时间轴
    </div>
    <div
      class="time-tabs__item"
      :class="{ active: tabIndex === 1 }"
      @click="switchTab(1)"
    >
      个人时间轴
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

interface Props {
  tabIndex: number
}

const props = withDefaults(defineProps<Props>(), {
  tabIndex: 0
})

const emits = defineEmits(['switch', 'export'])

// 切换tab
const switchTab = (index) => {
  emits('switch', index)
}
</script>
<style lang="scss" scoped>
.time-tabs {
  font-size: 0;

  &__item {
    display: inline-block;
    width: 170px;
    height: 45px;
    border-radius: 4px 4px 0 0;
    background: transparent;
    font-size: 16px;
    color: #868070;
    text-align: center;
    line-height: 45px;
    cursor: pointer;

    &.active {
      background: #C2B594;
      color: #FEFEFE;
      font-weight: bold;
    }
  }
}
</style>
<style lang="scss">
.time-scroll__export-modal {
    .el-dialog__header {
      margin-right: 0;
      padding: 0;
      height: 60px;
      line-height: 60px;
      background: #C2B594;
      font-size: 20px;
      color: #6D6A63;
      text-align: center;
    }

    .el-dialog__footer {
      padding: 13px 0;
      text-align: center;
      border-top: 1px solid #DDDDDD;
    }

    &-button {
      width: 180px;

      &:last-child {
        margin-left: 68px;
      }
    }
  }
</style>
