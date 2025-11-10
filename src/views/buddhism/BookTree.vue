<template>
  <div class="book-tree">
    <p class="book-tree__title">读佛经</p>
    <div class="book-tree__content">
      <el-tree-v2
        :data="treeData"
        :props="props"
        :height="468"
        :item-size="32"
        @node-click="nodeClick"
      >
        <template #default="{ node }">
          <el-icon
            class="node-icon book-tree__icon"
            :class="{ 'is-leaf': node.isLeaf }"
            color="#e6a23c"
          >
            <Collection />
          </el-icon>
          <span class="book-tree__text">{{ node.label }}</span>
        </template>
      </el-tree-v2>
    </div>
  </div>
</template>
<script lang="ts" setup>
import "echarts-wordcloud";
import { onMounted, ref } from "vue";
import { getdirectoryApi } from "@/api/common";
import { Collection } from "@element-plus/icons-vue";

interface Tree {
  id: string;
  label: string;
  children?: Tree[];
}

const props = {
  value: "path",
  label: "name",
  children: "children",
};
const treeData = ref([]);

const getData = async () => {
  const res: any = await getdirectoryApi();
  if (res.code === 0) {
    const data = res.data || {};
    treeData.value = data.items || [];
  }
};

const nodeClick = (v) => {
  console.log("$$$$$$$$$$", v);
};

onMounted(() => {
  getData();
});
</script>
<style lang="scss" scoped>
.book-tree {
  width: 588px;
  height: 536px;
  padding: 0 26px;
  box-sizing: border-box;
  background: #fff;
  border-radius: 4px;

  &__title {
    font-size: 16px;
    font-family: Microsoft YaHei;
    color: #6d6a63;
    line-height: 54px;
  }

  &__content {
    width: 536px;
    height: 447px;
    border-radius: 4px;
  }

  &__text {
    font-size: 16px;
  }

  &__icon {
    margin-right: 10px;
    font-size: 16px;
  }
}
</style>
