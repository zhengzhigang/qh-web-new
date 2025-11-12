<template>
  <div class="nav-wrapper">
    <div class="flex justify-between h-70px w-1200px ml-auto mr-auto">
      <img
        class="logo"
        style="cursor: pointer"
        src="@/assets/logo.png"
        @click="linkPage('home')"
      />
      <div class="nav flex justify-between">
        <span
          class="nav__item"
          :class="type === 1 && 'active'"
          @click="changeTopMenu(1)"
          >诗词搜索</span
        >
        <span
          class="nav__item"
          :class="type === 2 && 'active'"
          @click="changeTopMenu(2)"
          >标签搜索</span
        >
        <span
          class="nav__item"
          :class="type === 3 && 'active'"
          @click="changeTopMenu(3)"
          >时间轴</span
        >
        <span
          class="nav__item"
          :class="type === 4 && 'active'"
          @click="changeTopMenu(4)"
          >佛教</span
        >
        <span
          class="nav__item"
          :class="type === 5 && 'active'"
          @click="changeTopMenu(5)"
          >地震</span
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
const { currentRoute } = useRouter();
const router = useRouter();
const route = currentRoute.value;

const props = defineProps({
  type: Number,
});

const changeTopMenu = (type: number) => {
  if (type == 1) {
    router.push({ path: "home" });
  }
  if (type == 2) {
    router.push({ path: "tag" });
  }
  if (type == 3) {
    router.push({ path: "timeScrollHistory" });
  }
  if (type == 4) {
    router.push({ path: "buddhism" });
  }
  if (type == 5) {
    router.push({ path: "earthquake" });
  }
};

const linkPage = (routePage: any) => {
  const to = router.resolve({
    name: routePage,
  });
  window.open(to.href, "_blank");
};
</script>
<style lang="less" scoped>
.nav-wrapper {
  width: 100%;
  margin: auto;
  background: rgba(84, 80, 69, 0.4);
}

.logo {
  width: 168px;
  height: 45px;
  margin-top: 8px;
}

.nav {
  &__item {
    height: 65px;
    margin: 0 15px;
    padding: 0 20px;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
    line-height: 65px;
    &.active,
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
