<template>
  <div class="home bg-white">
    <div class="home__header">
      <div class="home__header-wraper">
        <div class="flex justify-between h-70px w-1200px ml-auto mr-auto">
          <img
            class="home__header-logo"
            style="cursor: pointer"
            src="@/assets/中央民族大学校徽图片-512px.png"
            @click="linkPage('home')"
          />
          <div class="home__nav flex justify-between">
            <div class="home__nav-wrapper flex">
              <span
                class="home__nav-button"
                :class="poemTabActive[0] == true ? 'active' : ''"
                @click="changePoemTab(true, false, false)"
                >诗人</span
              >
              <span
                class="home__nav-button"
                :class="poemTabActive[1] == true ? 'active' : ''"
                @click="changePoemTab(false, true, false)"
                >诗题</span
              >
              <span
                class="home__nav-button"
                :class="poemTabActive[2] == true ? 'active' : ''"
                @click="changePoemTab(false, false, true)"
                >诗文</span
              >
            </div>
            <div class="ml-auto mr-auto pl-20px">
              <div class="home__nav-select mt-16px mb-1px">
                <input
                  type="text"
                  v-model="datas.searchStr"
                  :placeholder="searchPlaceholder"
                  :style="{ width: '440px' }"
                  @keyup.enter="searchAction"
                />
                <span class="searchBtn" @click="searchAction">{{
                  loading ? "搜索中..." : "搜索"
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section
      v-loading="loading"
      class="home__content w-1140px ml-auto mr-auto pt-28px pb-28px pl-28px pr-28px"
    >
      <div class="home__details">
        <div class="home__details-item">
          <!-- 诗人tab：按诗人名检索作品列表 -->
          <template v-if="poemTabActive[0]">
            <p class="text-18px flex justify-between">
              <span
                >诗人：<span class="home__author-name">{{
                  datas.authorName
                }}</span></span
              >
              <el-button v-if="total > 0" @click="exportByAuthorNameAction"
                >导出</el-button
              >
            </p>
            <template
              v-for="(item, index) in datas.postListPage.list"
              :key="index"
            >
              <div class="home__production">
                <span class="home__production-title">{{ item.title }}</span>
                <p class="home__production-text">{{ item.content }}</p>
              </div>
            </template>
            <div v-if="total == 0" class="home__empty">
              没有找到该诗人的作品
            </div>
          </template>
          <!-- 诗题/诗文tab：ES检索结果 -->
          <template v-else>
            <template
              v-for="(item, index) in datas.esPage.records"
              :key="index"
            >
              <div class="home__production">
                <span class="home__production-title" v-html="item.title"></span
                >&nbsp;
                <span
                  v-if="item.authorSourceDO?.excelName"
                  class="home__production-title"
                  >{{ item.authorSourceDO?.excelName }}</span
                >
                <p class="home__production-text" v-html="item.content"></p>
              </div>
            </template>
            <div v-if="total == 0" class="home__empty">没有找到相关内容</div>
          </template>
        </div>
      </div>
      <el-pagination
        v-if="total > 0"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 50]"
        :small="false"
        :disabled="false"
        :background="true"
        layout="total, sizes,prev, pager, next,jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </section>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, onMounted } from "vue";
import {
  listPostPageByAuthorName,
  searchPostTitle,
  searchPostContent,
} from "@/api/common";

const poemTabActive = ref([true, false, false]);
const loading = ref(false);
const searchPlaceholder = computed(() => {
  if (poemTabActive.value[0]) return "请输入诗人名字，如：李白";
  if (poemTabActive.value[1]) return "请输入诗题关键词";
  return "请输入诗文关键词";
});
const changePoemTab = async (
  active1: boolean,
  active2: boolean,
  active3: boolean
) => {
  datas.searchStr = "";
  datas.authorName = "";
  datas.postListPage = {};
  datas.esPage = {};
  total.value = 0;
  currentPage.value = 1;
  poemTabActive.value = [active1, active2, active3];
};
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const handleSizeChange = (val: number) => {
  searchByPage(1, val);
};
const handleCurrentChange = (val: number) => {
  searchByPage(val, pageSize.value);
};
const searchByPage = (pageNo: number, pageSizeParam: number) => {
  if (loading.value) {
    return;
  }
  if (poemTabActive.value[0]) {
    listPostPageByAuthorNameAction(pageNo, pageSizeParam);
  } else if (poemTabActive.value[1]) {
    searchPostTitleAction(pageNo, pageSizeParam);
  } else if (poemTabActive.value[2]) {
    searchPostContentAction(pageNo, pageSizeParam);
  }
};
const datas = reactive({
  searchStr: "",
  // 诗人名字（从返回的作品列表中取）
  authorName: "",
  esPage: {} as any,
  postListPage: [] as any,
});
onMounted(() => {
  // 默认加载李白的作品
  datas.searchStr = "李白";
  listPostPageByAuthorNameAction(1, pageSize.value);
});
// 按诗人名分页查询作品（ poet-search 页迁移）
const listPostPageByAuthorNameAction = async (
  pageNo: number = 1,
  pageSizeParam: number = 10
) => {
  loading.value = true;
  listPostPageByAuthorName({
    pageNo: pageNo,
    pageSize: pageSizeParam,
    authorName: datas.searchStr.trim(),
  })
    .then((res) => {
      const data = res.data || {};
      datas.postListPage = data;
      total.value = data.total || 0;
      datas.authorName = data.list?.[0]?.authorName || datas.searchStr.trim();
      currentPage.value = pageNo;
      pageSize.value = pageSizeParam;
    })
    .finally(() => {
      loading.value = false;
    });
};
const searchAction = async () => {
  if (datas.searchStr.trim() == "") {
    return;
  }
  if (loading.value) {
    return;
  }
  searchByPage(1, pageSize.value);
};
const searchPostTitleAction = async (
  pageNo: number = 1,
  pageSizeParam: number = 10
) => {
  loading.value = true;
  searchPostTitle({
    postTitle: datas.searchStr,
    pageSize: pageSizeParam,
    pageNo: pageNo,
  })
    .then((res) => {
      console.log(res.data);
      datas.esPage = res.data || {};
      total.value = res.data?.total || 0;
      currentPage.value = pageNo;
      pageSize.value = pageSizeParam;
    })
    .finally(() => {
      loading.value = false;
    });
};
const searchPostContentAction = async (
  pageNo: number = 1,
  pageSizeParam: number = 10
) => {
  loading.value = true;
  searchPostContent({
    postContent: datas.searchStr,
    pageSize: pageSizeParam,
    pageNo: pageNo,
  })
    .then((res) => {
      console.log(res.data);
      datas.esPage = res.data || {};
      total.value = res.data?.total || 0;
      currentPage.value = pageNo;
      pageSize.value = pageSizeParam;
    })
    .finally(() => {
      loading.value = false;
    });
};

const exportByAuthorNameAction = () => {
  const params = new URLSearchParams({
    pageNo: "1",
    pageSize: String(total.value || 0),
    authorName: datas.searchStr.trim(),
  });
  const exportUrl =
    import.meta.env.VITE_URL +
    "/api/post/exportByAuthorName?" +
    params.toString();
  window.open(exportUrl, "_blank");
};
</script>
<style lang="less" scoped>
.el-pagination {
  margin-top: 20px;
  text-align: center;
}
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #2c3d50 !important; //修改默认的背景色
}
:deep(.el-select .el-input__wrapper) {
  height: 50px;
}

.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: url("@/assets/bcpic.png") repeat;

  &__header {
    background: #f0efe2;

    &-wrapper {
      width: 100%;
      margin: auto;
    }

    &-logo {
      width: 60px;
      height: 60px;
      margin-top: 5px;
    }
  }

  &__nav {
    &-button {
      height: 38px;
      padding: 0 24px;
      font-size: 16px;
      color: #5d6146;
      border-radius: 4px;
      cursor: pointer;
      white-space: nowrap;
      line-height: 38px;

      &.active {
        position: relative;
        background: #f85659;
        color: #fff;
      }
    }

    &-wrapper {
      flex-shrink: 0;
      align-items: center;
    }

    &-select {
      height: 38px;
      overflow: hidden;
      border-radius: 20px;

      ::v-deep .el-input__inner {
        text-align: center;
      }
      ::v-deep .el-input.is-focus .el-input__wrapper {
        box-shadow: 0 0 0 1px transparent inset !important;
      }
      ::v-deep .el-select .el-select__wrapper {
        border-radius: 0;
        box-shadow: none;
        border-right: 1px solid #dcdfe6;
      }
      ::v-deep .el-select .el-select__wrapper.is-focus {
        box-shadow: 0 0 0 1px transparent inset !important;
      }

      > input {
        width: 400px;
        height: 100%;
        outline: none;
        text-indent: 30px;
        font-size: 14px;
      }
      .searchBtn {
        display: inline-block;
        background: #f85659;
        width: 100px;
        height: 100%;
        line-height: 38px;
        text-align: center;
        color: #fff;
        font-size: 14px;
        font-weight: 500;
        margin: 0;
        cursor: pointer;
      }
    }
  }

  &__content {
    flex: 1;
    border-radius: 8px;
    background: #f0efe2;
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;

    > .home__details {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
  }

  &__details {
    &-item {
      margin-bottom: 40px;
      > p {
        color: #2c3d50;
        &:first-of-type {
          margin-bottom: 20px;
          font-weight: 500;
        }
      }
    }
  }

  &__author-name {
    color: #f85659;
    font-weight: 600;
  }

  &__empty {
    padding: 40px 0;
    text-align: center;
    color: #2c3d50;
    font-size: 14px;
  }

  &__production {
    margin-bottom: 40px;

    &-title {
      display: inline-block;
      margin-bottom: 10px;
      font-size: 16px;
      color: #2c3d50;
      font-weight: 500;
    }
    &-text {
      font-size: 14px;
      color: #2c3d50;
      white-space: pre-wrap;
    }
  }
}
</style>
