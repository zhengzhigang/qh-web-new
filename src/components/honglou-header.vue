<template>
  <div class="honglou-header">
    <div
      class="honglou-header__content w-1200px ml-auto mr-auto flex justify-between items-center h-60px"
    >
      <div class="flex items-center">
        <img
          class="honglou-header__logo"
          src="@/assets/中央民族大学校徽图片-512px.png"
          @click="linkPage('honglou-welcome')"
        />
        <span class="honglou-header__title ml-20px">知识图谱问答系统</span>
      </div>
      <div class="honglou-header__nav">
        <span
          class="honglou-header__nav-item"
          :class="{ active: currentRoute === 'honglou-welcome' }"
          @click="linkPage('honglou-welcome')"
        >
          <el-icon class="mr-2"><House /></el-icon>
          首页
        </span>
        <span
          class="honglou-header__nav-item"
          :class="{ active: currentRoute === 'honglou-search' }"
          @click="linkPage('honglou-search')"
        >
          <el-icon class="mr-2"><Connection /></el-icon>
          人物关系
        </span>
        <span
          class="honglou-header__nav-item"
          :class="{ active: currentRoute === 'honglou-all-relation' }"
          @click="linkPage('honglou-all-relation')"
        >
          <el-icon class="mr-2"><Grid /></el-icon>
          人物关系全貌
        </span>
        <span
          class="honglou-header__nav-item"
          :class="{ active: currentRoute === 'honglou-qa' }"
          @click="linkPage('honglou-qa')"
        >
          <el-icon class="mr-2"><ChatDotRound /></el-icon>
          人物关系问答
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const currentRoute = computed(() => route.name as string);

const linkPage = (page: string) => {
  router.push({ name: page });
};
</script>
<style lang="less" scoped>
.honglou-header {
  color: white;
  border-bottom: 2px solid #8b1c1c;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  width: 100%;
  background: linear-gradient(to right, rgba(92, 0, 0, 1), rgba(139, 0, 0, 1));

  &__content {
    height: 60px;
  }

  &__logo {
    width: 40px;
    height: 40px;
    cursor: pointer;
  }

  &__title {
    font-size: 18px;
    font-weight: bold;
  }

  &__nav {
    display: flex;
    align-items: center;

    &-item {
      margin-left: 24px;
      cursor: pointer;
      font-size: 14px;
      padding: 4px 8px;
      border-radius: 4px;
      display: flex;
      align-items: center;

      &.active {
        font-weight: bold;
        background: rgba(255, 255, 255, 0.2);
      }

      &:hover {
        color: #f3f4f6;
        background: rgba(255, 255, 255, 0.1);
      }

      .el-icon {
        font-size: 16px;
        vertical-align: middle;
      }
    }
  }
}
</style>
