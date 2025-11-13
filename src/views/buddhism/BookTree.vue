<template>
  <div class="book-tree">
    <p class="book-tree__title">读佛经</p>
    <div class="book-tree__content">
      <el-tree style="max-width: 600px; max-height: 465px; overflow-y: auto;" :props="props" :load="loadNode" lazy @node-click="nodeClick">
        <template #default="{ node }">
          <el-icon
            class="node-icon book-tree__icon"
            :class="{ 'is-leaf': node.isLeaf }"
            color="#e6a23c"
          >
            <Collection v-if="!node.isLeaf" />
            <Tickets v-else />
          </el-icon>
          <span class="book-tree__text">{{ node.label }}</span>
        </template>
      </el-tree>
    </div>
  </div>
</template>
<script lang="ts" setup>
import "echarts-wordcloud";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getdirectoryApi } from "@/api/common";
import { Collection } from "@element-plus/icons-vue";

const router = useRouter();

interface Tree {
  id: string;
  label: string;
  children?: Tree[];
}

const props = {
  value: "path",
  label: "name",
  children: "children",
  isLeaf: 'isLeaf'
};
const treeData = ref([]);

const loadNode = async (node, resolve, reject) => {
  // if (node.level === 0 || node.level === 1) {
    const path = node.level === 0 ? '' : node.data.path
    const res: any = await getdirectoryApi({ path });
    if (res.code === 0) {
      const data = res.data || {};
      treeData.value = (data.items || []).map((item) => ({
        ...item,
        isLeaf: !item.directory
      }));
      const list = (data.items || []).map((item) => ({
        ...item,
        isLeaf: !item.directory
      }));
      return resolve(list)
    }
  // }
}

const nodeClick = (node) => {
  if (!node.isLeaf) return
  // router.push({
  //   path: "/buddhism/detail",
  //   query: {
  //     path: node.path
  //   }
  // });

  const { href } = router.resolve({
    path: '/buddhism/detail',
    query: { path: node.path }
  })

  // 2. 在新窗口/标签页中打开
  window.open(href, '_blank', 'noopener,noreferrer')

};
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
