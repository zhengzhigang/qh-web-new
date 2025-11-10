<template>
  <div class="time-scroll bg-white">
    <div class="time-scroll__header">
      <Header :type="3"></Header>
    </div>
    <div
      class="time-scroll__main"
      v-loading.fullscreen.lock="state.loading"
      element-loading-text="加载中、请稍候..."
      element-loading-background="rgba(216, 207, 180, 0.4)"
    >
      <div style="margin-bottom: 30px">
        <div class="time-scroll__land">
          <div class="time-scroll__land-item">
            <BookTree></BookTree>
          </div>
          <div class="time-scroll__land-item">
            <time-wordcloud></time-wordcloud>
          </div>
        </div>
      </div>
    </div>
    <div class="time-scroll__content">
      <BuddhismSearch></BuddhismSearch>
    </div>
    <Footer></Footer>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref } from "vue";
import Header from "@/components/headerNew.vue";
import Footer from "@/components/footer.vue";
import TimeWordcloud from "./TimeWordcloud.vue";
import BookTree from "./BookTree.vue";
import BuddhismSearch from "./BuddhismSearch.vue";

const branchOptions = [
  { value: "全真和正一", label: "一级 1" },
  { value: "2", label: "一级 2" },
  { value: "3", label: "一级 3" },
];

const state = reactive<{
  [key: string]: any;
}>({
  loading: false,
});
</script>
<style lang="less" scoped>
.time-scroll {
  background: #fcf9f1;

  &__header {
    height: 440px;
    background: url("@/assets/bj.png");
    background-size: 100% auto;
    background-repeat: no-repeat;
  }

  &__main {
    position: relative;
    margin: -352px 0 0 50%;
    transform: translate(-50%);
    width: 1200px;
    background-repeat: repeat-y;
    background-position: center;
    background-size: 1150px auto;
    border-radius: 5px;
  }

  &__land {
    display: flex;
    justify-content: space-between;
    margin-bottom: 26px;

    &-item {
      width: 588px;
    }
  }

  &__item {
    margin-bottom: 40px;
    &-title {
      display: inline-block;
      margin-bottom: 10px;
      font-size: 16px;
      color: #2c3d50;
      font-weight: 500;
    }
    &-content {
      font-size: 14px;
      color: #2c3d50;
    }
  }

  &__content {
    max-width: 1200px;
    width: 100%;
    margin: auto;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
  }
}
</style>
