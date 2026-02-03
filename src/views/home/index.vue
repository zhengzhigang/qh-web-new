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
                <el-select
                  v-show="poemTabActive[0] == true"
                  v-model="datas.index"
                  placeholder=""
                  size="large"
                  style="width: 140px"
                >
                  <el-option label="模糊查找" value="-1" />
                  <el-option label="第1个字" value="1" />
                  <el-option label="第2个字" value="2" />
                  <el-option label="第3个字" value="3" />
                  <el-option label="第4个字" value="4" />
                  <el-option label="最后一个字" value="99" />
                </el-select>

                <input
                  type="text"
                  v-model="datas.searchStr"
                  :style="{ width: poemTabActive[0] ? '300px' : '440px' }"
                  @keyup.enter="searchAction"
                />
                <span class="searchBtn" @click="searchAction">搜索</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section
      class="home__content w-1140px ml-auto mr-auto pt-28px pb-28px pl-28px pr-28px"
    >
      <template v-if="datas.singleMatch == 1">
        <div class="home__details">
          <div class="home__details-item">
            <canvasPage :personId="datas.personId" />
          </div>
        </div>
      </template>
    </section>

    <section
      class="home__content w-1140px ml-auto mr-auto pt-28px pb-28px pl-28px pr-28px"
    >
      <template v-if="datas.singleMatch == 1">
        <div class="home__details">
          <div class="home__details-item" v-if="datas.authorId != '0'">
            <p class="text-18px flex justify-between">
              作品 :<el-button @click="exportByAuthorIdAction(datas.authorId)"
                >导出</el-button
              >
            </p>
            <template v-for="(item, index) in datas.postListPage.list">
              <div class="home__production">
                <span class="home__production-title">{{ item.title }}</span>
                <p class="home__production-text">{{ item.content }}</p>
              </div>
            </template>
          </div>
        </div>
      </template>
      <template v-else>
        <ul>
          <template v-if="postListPageFlag">
            <li
              v-for="item in datas.postListPage.list"
              :key="item.authorId"
              v-html="item.name"
            ></li>
          </template>
          <template v-else-if="poemTabActive[0]">
            <li v-for="item in datas.esPage.records">
              <a
                href="javascript:void(0)"
                @click="linkToAuthor(item.personId)"
                v-html="item.name"
              ></a>
            </li>
          </template>
          <template v-else>
            <li v-for="item in datas.esPage.records">
              <div class="home__production">
                <span class="home__production-title" v-html="item.title"></span
                >&nbsp;
                <span
                  v-if="
                    (poemTabActive[1] || poemTabActive[2]) &&
                    item.authorSourceDO?.excelName
                  "
                  class="home__production-title"
                  >{{ item.authorSourceDO?.excelName }}</span
                >
                <p class="home__production-text" v-html="item.content"></p>
              </div>
            </li>
          </template>
        </ul>
      </template>
      <el-pagination
        v-if="datas.authorId != '0'"
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
import canvasPage from "./canvas.vue";
import { computed, reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import {
  searchAuthor,
  searchPoetAuthorId,
  listPostPage,
  searchPostTitle,
  searchPostContent,
  findAuthorIdByPersonId,
} from "@/api/common";
import JSONBig from "json-bigint";
const { currentRoute } = useRouter();
const router = useRouter();
const route = currentRoute.value;

const poemTabActive = ref([true, false, false]);
const changePoemTab = async (
  active1: boolean,
  active2: boolean,
  active3: boolean
) => {
  datas.searchStr = "";
  poemTabActive.value = [active1, active2, active3];
};
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  if (poemTabActive.value[0]) {
    if (postListPageFlag.value == true) {
      listPostPageAction(datas.authorInfo.authorId, 1, val);
    } else {
      searchAuthorAction(1, val);
    }
  }
  if (poemTabActive.value[1]) {
    searchPostTitleAction(1, val);
  }
  if (poemTabActive.value[2]) {
    searchPostContentAction(1, val);
  }
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  if (poemTabActive.value[0]) {
    if (postListPageFlag.value == true) {
      listPostPageAction(datas.authorInfo.authorId, val, pageSize.value);
    } else {
      searchAuthorAction(val);
    }
  }
  if (poemTabActive.value[1]) {
    searchPostTitleAction(val);
  }
  if (poemTabActive.value[2]) {
    searchPostContentAction(val);
  }
};
const postListPageFlag = ref(true);
const datas = reactive({
  cbdbPersonId: null,
  searchStr: "",
  //首页是否显示一个作者的信息
  authorId: "0",
  personId: "0",
  singleMatch: 1,
  esPage: {} as any,
  authorInfo: {} as any,
  personInfo: {} as any,
  postListPage: [] as any,
  index: "-1",
});
onMounted(async () => {
  if (!route.query.authorId) {
    //如果没有传authorId，如果没有传personId就默认是李白，如果传了personid就用传的personid,authorid就没有了
    if (!route.query.personId) {
      datas.personId = JSONBig.parse("32540");
      datas.authorId = JSONBig.parse("2016760907028709538");
    } else {
      datas.personId = JSONBig.parse(route.query.personId);
      await findAuthorIdByPersonId({ personId: datas.personId }).then((res) => {
        datas.authorId = res.data.toString();
      });
    }
  } else {
    datas.authorId = JSONBig.parse(route.query.authorId);
    datas.personId = JSONBig.parse(route.query.personId);
  }

  searchPoetAuthorId({
    authorId: datas.authorId.toString(),
    personId: datas.personId.toString(),
    pageSize: pageSize.value,
    pageNo: currentPage.value,
  }).then((res) => {
    if (res.data.singleMatch == 1) {
      datas.singleMatch = 1;
      datas.authorInfo = res.data.authorInfo;
      datas.searchStr = res.data.authorInfo.name;
      listPostPageAction(datas.authorInfo.authorId);
    } else {
      postListPageFlag.value = false;
      datas.singleMatch = 0;
      datas.esPage = res.data.esAuthorEsPage;
      total.value = res.data.esAuthorEsPage.total;
      currentPage.value = res.data.esAuthorEsPage.current;
      pageSize.value = res.data.esAuthorEsPage.pageSize;
    }
  });
});
const listPostPageAction = async (
  authorId: any,
  currentPage: number = 1,
  pageSize: number = 10
) => {
  listPostPage({
    authorId: authorId.toString(),
    pageSize: pageSize,
    pageNo: currentPage,
  }).then((res) => {
    postListPageFlag.value = true;
    datas.postListPage = res.data;
    total.value = res.data.total;
  });
};
const searchAction = async () => {
  if (datas.searchStr == "") {
    return;
  }
  if (poemTabActive.value[0]) {
    searchAuthorAction();
  }
  if (poemTabActive.value[1]) {
    searchPostTitleAction();
  }
  if (poemTabActive.value[2]) {
    searchPostContentAction();
  }
};
const searchAuthorAction = async (
  pageNo: number = 1,
  pageSizeParam: number = 20
) => {
  searchAuthor({
    authorName: datas.searchStr,
    index: datas.index,
    pageSize: pageSizeParam,
    pageNo: pageNo,
  }).then((res) => {
    console.log(res.data);
    if (res.data.singleMatch == 1) {
      datas.singleMatch = 1;
      datas.authorInfo = res.data.authorInfo;
      datas.personId = res.data.authorInfo.personId;
      listPostPageAction(datas.authorInfo.authorId, 1, 10);
    } else if (res.data.singleMatch == 0) {
      postListPageFlag.value = false;
      datas.singleMatch = 0;
      datas.esPage = res.data.esAuthorEsPage;
      total.value = res.data.esAuthorEsPage.total;
      currentPage.value = res.data.esAuthorEsPage.current;
      pageSize.value = res.data.esAuthorEsPage.pageSize;
    } else if (res.data.singleMatch == -1) {
      ElMessage.error("没有找到匹配的人.");
    }
  });
};
const searchPostTitleAction = async (
  pageNo: number = 1,
  pageSizeParam: number = 20
) => {
  searchPostTitle({
    postTitle: datas.searchStr,
    pageSize: pageSizeParam,
    pageNo: pageNo,
  }).then((res) => {
    console.log(res.data);
    postListPageFlag.value = false;
    datas.esPage = res.data;
    datas.singleMatch = 0;
    total.value = res.data.total;
    currentPage.value = res.data.current;
    pageSize.value = res.data.pageSize;
  });
};
const searchPostContentAction = async (
  pageNo: number = 1,
  pageSizeParam: number = 20
) => {
  searchPostContent({
    postContent: datas.searchStr,
    pageSize: pageSizeParam,
    pageNo: pageNo,
  }).then((res) => {
    console.log(res.data);
    postListPageFlag.value = false;
    datas.esPage = res.data;
    datas.singleMatch = 0;
    total.value = res.data.total;
    currentPage.value = res.data.current;
    pageSize.value = res.data.pageSize;
  });
};

const exportByAuthorIdAction = (authorId: any) => {
  console.log("exportByAuthorIdAction:", authorId);
  const exportUrl = `${
    import.meta.env.VITE_URL
  }/post/exportByAuthorId?authorId=${authorId}`;
  window.open(exportUrl, "_blank");
  return true;
};

const linkToAuthor = (personId: any) => {
  const to = router.resolve({
    name: "home", //这里是跳转页面的name，要与路由设置保持一致
    query: { personId: personId },
  });
  window.open(to.href, "_blank");
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
    border-radius: 8px;
    background: #f0efe2;
    margin-top: 20px;
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
    }
  }
}
</style>
