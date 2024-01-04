<template>
  <div class="time-tabs">
    <div
      class="time-tabs__item"
      :class="{ active: active === 0 }"
      @click="switchTab(0)"
    >
      历史时间轴
    </div>
    <div
      class="time-tabs__item"
      :class="{ active: active === 1 }"
      @click="switchTab(1)"
    >
      个人时间轴
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter();

interface Props {
  active: number
}

withDefaults(defineProps<Props>(), {
  active: 0
})

const emits = defineEmits(["switch", "export"]);

// 切换tab
const switchTab = (index) => {
  // emits('switch', index)
  let routeUrl;
  if (index === 0) {
    routeUrl = router.resolve({
      path: "/timeScrollHistory"
    });
    window.open(routeUrl.href, "_blank");
  } else {
    routeUrl = router.resolve({
      path: "/timeScrollPerson"
    });
  }
  window.open(routeUrl.href, "_blank");
};
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
      background: #c2b594;
      color: #fefefe;
      font-weight: bold;
    }
  }
}
</style>
