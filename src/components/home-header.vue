<template>
  <div class="home-header">
    <div
      class="home-header__content w-1200px ml-auto mr-auto flex justify-between items-center h-60px"
    >
      <div class="flex items-center">
        <img
          class="home-header__logo"
          src="@/assets/中央民族大学校徽图片-512px.png"
          @click="linkPage('home')"
        />
        <span class="home-header__title ml-20px">民大课程平台</span>
      </div>
      <div class="home-header__nav">
        <span class="home-header__nav-item active">
          <el-icon class="mr-2"><House /></el-icon>
          首页
        </span>
        <span class="home-header__nav-item">
          <el-icon class="mr-2"><Reading /></el-icon>
          教学大纲
        </span>
        <span class="home-header__nav-item">
          <el-icon class="mr-2"><Document /></el-icon>
          课件
        </span>
        <span class="home-header__nav-item" @click="linkPage('experiment')">
          <el-icon class="mr-2"><Opportunity /></el-icon>
          课时实验
        </span>
        <span class="home-header__nav-item">
          <el-icon class="mr-2"><SetUp /></el-icon>
          二次开发
        </span>
        <span class="home-header__nav-item">
          <el-icon class="mr-2"><VideoCamera /></el-icon>
          视频
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter();

const linkPage = (page: string) => {
  router.push({ name: page });
};
</script>
<style lang="less" scoped>
.home-header {
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