<template>
  <div id="container" class="cls-container">
    <!-- 顶部导航栏 -->
    <kgqa-header />
    <div class="cls-content" style="margin-top: 150px">
      <div class="mar-ver pad-btm">
        <p class="text-muted" style="color: white">
          基于知识图谱的《红楼梦》人物关系可视化及问答系统
        </p>
        <a id="a" @click="navigateToSearch">开启探索</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ElButton } from "element-plus";
import KgqaHeader from "@/components/kgqa-header.vue";

const router = useRouter();

const navigateToSearch = () => {
  router.push({
    path: "/kgqa/search",
  });
};
</script>

<style scoped>
#container {
  background: url(../../assets/bk2.jpg);
  background-position: 100% 100%;
  background-size: 100% auto;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

#a {
  font-size: 18px;
  width: 230px;
  display: block;
  margin: 0 auto;
  padding: 12px 50px;
  border-radius: 5px;
  border: 1px solid #f2f2f2;
  background-color: transparent;
  text-align: center;
  color: #f2f2f2;
  cursor: pointer;
  text-decoration: none;
}

#a:hover {
  background-color: #249e92;
  cursor: pointer;
}

p {
  font-size: 40px;
  font-weight: lighter;
  margin-bottom: 90px;
  text-align: center;
}
</style>