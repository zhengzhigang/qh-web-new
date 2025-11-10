<template>
  <div class="buddhism-detail time-scroll bg-white">
    <div class="buddhism-detail__header">
      <Header :type="4"></Header>
    </div>
    <div
      class="buddhism-detail__main"
      v-loading.fullscreen.lock="state.loading"
      element-loading-text="加载中、请稍候..."
      element-loading-background="rgba(216, 207, 180, 0.4)"
    >
    <!-- 使用 v-html 渲染解析后的 HTML -->
    <div v-if="htmlContent" v-html="htmlContent"></div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref } from "vue";
import Header from "@/components/headerNew.vue";
import Footer from "@/components/footer.vue";
import { getContentApi } from "@/api/common";
import { useRoute } from "vue-router";
import { marked } from 'marked'

const route = useRoute()

const state = reactive<{
  [key: string]: any;
}>({
  loading: false,
});
const htmlContent = ref('')

const loadContent = async () => {
  state.loading = true
  try {
    const res: any = await getContentApi({ filePath: route.query.path })
    if (res.code === 0) {
      console.log('====', res)
      htmlContent.value = await marked.parse(res.data.content)
    }
  } finally {
    state.loading = false
  }
}

onMounted(() => {
  loadContent()
})
</script>
<style lang="less" scoped>
.buddhism-detail {
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
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    background-color: #fff;
    min-height: calc(100vh - 240px);
  }

  &__land {
    display: flex;
    justify-content: space-between;
    margin-bottom: 26px;
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
