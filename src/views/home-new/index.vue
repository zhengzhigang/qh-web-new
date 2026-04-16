<template>
  <div class="home-new">
    <!-- 顶部导航栏 -->
    <home-header />

    <!-- 背景图片区域 -->
    <div class="home-new__banner">
      <div class="home-new__banner-content w-1200px ml-auto mr-auto">
        <div class="home-new__banner-university">
          <span class="home-new__banner-university-line"></span>
          <span class="home-new__banner-university-text">中央民族大学</span>
          <span class="home-new__banner-university-line"></span>
        </div>
        <h1 class="home-new__banner-title">在线教学实验平台</h1>
        <p class="home-new__banner-subtitle">知识引领未来 · 实验成就卓越</p>
        <button class="home-new__banner-btn" @click="linkPage('home')">
          进入系统
          <span class="home-new__banner-btn-arrow">→</span>
        </button>
      </div>
    </div>

    <!-- 教学内容区域 -->
    <div class="home-new__content">
      <div class="home-new__content-inner w-1200px ml-auto mr-auto">
        <h3 class="home-new__content-title">教学内容</h3>
        <div class="home-new__content-cards">
          <div class="home-new__content-card">
            <div class="home-new__content-card-top">
              <span class="en">Syllabus</span>
              <span class="cn">教学大纲</span>
            </div>
            <p class="home-new__content-card-desc">
              系统的课程体系规划，明确学习目标与知识结构，引导学生有序掌握知识。
            </p>
            <a href="#" class="home-new__content-card-link">查看详情 →</a>
          </div>
          <div class="home-new__content-card">
            <div class="home-new__content-card-top">
              <span class="en">Courseware</span>
              <span class="cn">课件资源</span>
            </div>
            <p class="home-new__content-card-desc">
              丰富的多媒体教学资源，适应不同学习风格，助力深度理解课程内容。
            </p>
            <a href="#" class="home-new__content-card-link">查看详情 →</a>
          </div>
          <div class="home-new__content-card">
            <div class="home-new__content-card-top">
              <span class="en">Experiment</span>
              <span class="cn">课时实验</span>
            </div>
            <p class="home-new__content-card-desc">
              五大核心实验项目，采用阶梯级难度动态分步，理论与实践紧密结合。
            </p>
            <a href="#" class="home-new__content-card-link">查看详情 →</a>
          </div>
          <div class="home-new__content-card">
            <div class="home-new__content-card-top">
              <span class="en">Development</span>
              <span class="cn">二次开发</span>
            </div>
            <p class="home-new__content-card-desc">
              基于平台开放接口与模块化结构，支持个性化定制化功能扩展，满足特殊教学需求。
            </p>
            <a href="#" class="home-new__content-card-link">查看详情 →</a>
          </div>
          <div class="home-new__content-card">
            <div class="home-new__content-card-top">
              <span class="en">Video</span>
              <span class="cn">视频教学</span>
            </div>
            <p class="home-new__content-card-desc">
              名师精心录制的视频课程，随时随地方便学习，反复观看，巩固知识掌握。
            </p>
            <a href="#" class="home-new__content-card-link">查看详情 →</a>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <div class="home-new__footer">
      <div
        class="home-new__footer-content w-1200px ml-auto mr-auto text-center"
      >
        <p>© 2024 中央民族大学在线教学实验平台 · 版权所有</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 导航栏组件已经在home-header.vue中定义
</script>
<style lang="scss" scoped>
.home-new {
  &__banner {
    background: url("@/assets/banner.png") no-repeat center center;
    background-size: cover;
    height: 400px;
    position: relative;
    margin-top: 60px;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
    }

    &-content {
      position: relative;
      z-index: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: white;

      &-university {
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        &-line {
          width: 80px;
          height: 2px;
          background: #ffc107;
          margin: 0 20px;
        }

        &-text {
          font-size: 16px;
          color: #ffc107;
          letter-spacing: 2px;
        }
      }

      &-title {
        font-size: 48px;
        font-weight: bold;
        margin-bottom: 16px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      }

      &-subtitle {
        font-size: 18px;
        margin-bottom: 40px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      }

      &-btn {
        background: #a81c1c;
        color: white;
        border: 2px solid #a81c1c;
        padding: 16px 40px;
        font-size: 18px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;

        &:hover {
          background: transparent;
          transform: translateY(-2px);
        }

        &-arrow {
          margin-left: 10px;
          font-size: 20px;
        }
      }
    }
  }

  &__content {
    padding: 60px 0;
    background: #f5f5f5;

    &-inner {
      text-align: center;
    }

    &-title {
      font-size: 32px;
      font-weight: bold;
      color: #a81c1c;
      margin-bottom: 50px;
      position: relative;

      &::after {
        content: "";
        position: absolute;
        bottom: -15px;
        left: 50%;
        transform: translateX(-50%);
        width: 80px;
        height: 3px;
        background: #a81c1c;
      }
    }

    &-cards {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 24px;

      @media (max-width: 1200px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    &-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;
      overflow: hidden;
      text-align: left;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
          0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }

      &-top {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        font-size: 18px;
        font-weight: bold;
        color: #fff;
        margin-bottom: 16px;
        padding: 16px 24px;
        background: linear-gradient(
          to right,
          rgba(92, 0, 0, 1),
          rgba(139, 0, 0, 1)
        );
        color: #fff;

        &.en {
          color: rgba(232, 201, 106, 1);
        }
      }

      &-desc {
        font-size: 14px;
        color: #555555;
        padding: 20px 14px;
        line-height: 1.6;
        text-align: left;
      }

      &-link {
        color: #a81c1c;
        font-size: 14px;
        text-decoration: none;
        display: inline-block;
        padding: 0 24px;
        margin-bottom: 20px;

        &:hover {
          text-decoration: underline;
          transform: translateX(5px);
        }
      }
    }
  }

  &__footer {
    background: #1a1a1a;
    color: white;
    padding: 30px 0;
    border-top: 3px solid rgba(201, 168, 76, 1);
    background: linear-gradient(
      to right,
      rgba(92, 0, 0, 1),
      rgba(139, 0, 0, 1)
    );

    &-content {
      font-size: 14px;
      line-height: 1.5;
    }
  }
}
</style>