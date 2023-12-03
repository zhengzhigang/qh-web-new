<template>
  <div class="time-data-summary">
    <div class="time-data-summary__item">
      <p class="time-data-summary__title">已系年事件数</p>
      <span class="time-data-summary__number">{{ props.eventNumber.toLocaleString() }}</span>
    </div>
    <div class="time-data-summary__item">
      <p class="time-data-summary__title">已系年作品数</p>
      <span class="time-data-summary__number">{{ props.workNumber.toLocaleString() }}</span>
    </div>
    <div class="time-data-summary__item">
      <p class="time-data-summary__title">已系年关系数</p>
      <span class="time-data-summary__number">{{ props.relationNumber.toLocaleString() }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
interface Props {
  eventNumber: number
  workNumber: number
  relationNumber: number
}

const props = withDefaults(defineProps<Props>(), {
  eventNumber: 0,
  workNumber: 0,
  relationNumber: 0
})
</script>
<style lang="scss" scoped>
.time-data-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 197px;
  background: url('@/assets/time-summary-bg.png') center/100%;

  &__item {
    margin-top: -30px;
    padding: 0 79px;
    text-align: center;
  }

  &__title {
    margin-bottom: 26px;
    font-size: 14px;
    color: #868070;
    line-height: 36px;
  }

  &__number {
    font-size: 36px;
    line-height: 1;
    color: #6D6A63;
  }
}
</style>

