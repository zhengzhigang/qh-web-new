<template>
  <div class="time-dynasty">
    <span
      v-for="(item, index) in dynastyList"
      :key="index"
      class="time-dynasty__item"
      :style="getStyle(item)">{{ item.label }}</span>
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';

interface Props {
  start?: number
  end?: number
  dynastyList?: any[]
}

const props = withDefaults(defineProps<Props>(), {
  start: 600,
  end: 700,
  dynastyList: () => []
})

const getStyle = ({ start, end }) => {
  return {
    left: `${(start - props.start) / (props.end - props.start) * 100}%`,
    right: `${(props.end - end) / (props.end - props.start) * 100}%`
  }
}

onMounted(() => {

})
</script>
<style lang="scss" scoped>
.time-dynasty {
  position: relative;
  width: 100%;
  height: 28px;
  margin-bottom: 8px;
  margin-top: 2px;
  border-radius: 14px;
  background: #A79B7A;
  overflow: hidden;

  &__item {
    position: absolute;
    display: block;
    height: 28px;
    border-radius: 14px;
    background: #CFC2A0;
    font-size: 14px;
    color: #FCF9F1;
    text-align: center;
    line-height: 28px;
  }
}
</style>
