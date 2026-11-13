<template>
  <div class="poet-search bg-white">
    <div class="poet-search__header">
      <div class="poet-search__header-wrapper">
        <div class="poet-search__header-inner">
          <img
            class="poet-search__header-logo"
            style="cursor: pointer"
            src="@/assets/中央民族大学校徽图片-512px.png"
            @click="linkPage('home')"
          />
          <span class="poet-search__nav-title">诗人作品检索</span>
          <div class="poet-search__nav-select">
            <input
              type="text"
              v-model="searchStr"
              placeholder="请输入诗人名字，如：李白"
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

    <section
      v-loading="loading"
      class="poet-search__content w-1140px ml-auto mr-auto pt-28px pb-28px pl-28px pr-28px"
      :class="{ 'is-fill': !searched || total == 0 }"
    >
      <!-- 未搜索时的空状态 -->
      <div v-if="!searched" class="poet-search__placeholder">
        <img
          class="poet-search__placeholder-icon"
          src="@/assets/中央民族大学校徽图片-512px.png"
        />
        <p class="poet-search__placeholder-title">诗人作品检索</p>
        <p class="poet-search__placeholder-text">
          在上方输入框输入诗人名字，检索其全部作品，支持分页浏览与一键导出
        </p>
      </div>

      <template v-else>
        <div class="poet-search__details">
          <div class="poet-search__details-item">
            <p class="text-18px flex justify-between">
              <span
                >诗人：<span class="poet-search__author-name">{{
                  authorName
                }}</span></span
              >
              <el-button
                v-if="total > 0"
                type="primary"
                @click="exportByAuthorNameAction"
                >导出全部作品</el-button
              >
            </p>
            <template v-for="(item, index) in datas.postList" :key="index">
              <div class="poet-search__production">
                <span class="poet-search__production-title">{{
                  item.title
                }}</span>
                <p class="poet-search__production-text">{{ item.content }}</p>
              </div>
            </template>
            <!-- 搜索无结果时的空状态，占满剩余屏幕高度 -->
            <div v-if="total == 0" class="poet-search__empty">
              <el-empty description="没有找到该诗人的作品，换个名字试试吧" />
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
          </div>
        </div>
      </template>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { listPostPageByAuthorName } from "@/api/common";

const router = useRouter();
const searchStr = ref("");
const searched = ref(false);
const loading = ref(false);
const authorName = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const datas = reactive({
  postList: [] as any,
});

const searchAction = async () => {
  if (searchStr.value.trim() == "") {
    ElMessage.warning("请输入诗人名字");
    return;
  }
  if (loading.value) {
    return;
  }
  listPostPageAction(1, pageSize.value);
};

const listPostPageAction = async (pageNo: number, pageSizeParam: number) => {
  loading.value = true;
  listPostPageByAuthorName({
    pageNo: pageNo,
    pageSize: pageSizeParam,
    authorName: searchStr.value.trim(),
  })
    .then((res) => {
      searched.value = true;
      const data = res.data || {};
      datas.postList = data.list || [];
      total.value = data.total || 0;
      // 诗人名字从返回的作品列表中取
      authorName.value =
        datas.postList[0]?.authorName || searchStr.value.trim();
      currentPage.value = pageNo;
      pageSize.value = pageSizeParam;
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleSizeChange = (val: number) => {
  listPostPageAction(1, val);
};
const handleCurrentChange = (val: number) => {
  listPostPageAction(val, pageSize.value);
};

const exportByAuthorNameAction = () => {
  const params = new URLSearchParams({
    pageNo: "1",
    pageSize: String(total.value || 0),
    authorName: searchStr.value.trim(),
  });
  const exportUrl =
    import.meta.env.VITE_URL + "/api/post/exportByAuthorName?" + params.toString();
  window.open(exportUrl, "_blank");
};

const linkPage = (name: string) => {
  router.push({ name: name });
};
</script>

<style lang="less" scoped>
.el-pagination {
  margin-top: 20px;
  text-align: center;
}
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #2c3d50 !important;
}

.poet-search {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: url("@/assets/bcpic.png") repeat;

  &__header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: #f0efe2;
    box-shadow: 0 2px 8px rgba(44, 61, 80, 0.08);

    &-wrapper {
      width: 100%;
      margin: auto;
    }

    &-inner {
      display: flex;
      align-items: center;
      height: 70px;
      width: 1200px;
      max-width: calc(100% - 40px);
      margin: 0 auto;
    }

    &-logo {
      width: 60px;
      height: 60px;
      flex-shrink: 0;
    }
  }

  &__nav-title {
    margin-left: 16px;
    font-size: 20px;
    font-weight: 500;
    color: #2c3d50;
    white-space: nowrap;
  }

  &__nav-select {
    margin-left: auto;
    height: 38px;
    overflow: hidden;
    border-radius: 20px;

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

  &__content {
    border-radius: 8px;
    background: #f0efe2;
    margin-top: 20px;
    margin-bottom: 20px;
    min-height: 200px;

    // 未搜索或无结果时撑满剩余屏幕高度
    &.is-fill {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;

      > * {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
  }

  &__placeholder {
    text-align: center;
    color: #2c3d50;
    padding: 40px 0;

    &-icon {
      width: 88px;
      height: 88px;
      opacity: 0.85;
    }

    &-title {
      margin-top: 16px;
      font-size: 20px;
      font-weight: 600;
      color: #2c3d50;
    }

    &-text {
      margin-top: 8px;
      font-size: 14px;
      color: #5d6146;
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

  &__empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2c3d50;
    font-size: 14px;
  }
}
</style>