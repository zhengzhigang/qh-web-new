<template>
  <div class="buddhism-search">
    <el-form :inline="true" :model="searchForm" label-width="auto">
      <el-form-item label="宗教名称">
        <el-select v-model="searchForm.religionName" placeholder="请选择">
          <el-option
            v-for="item in religionOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="分支名称">
        <el-select v-model="searchForm.subBranch" placeholder="请选择">
          <el-option
            v-for="item in branchOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="地区" style="margin-right: 0">
        <el-cascader
          :props="props"
          clearable
          @change="provinceCgange"
          placeholder="请选择"
        />

        <!-- <el-select
            v-model="searchForm.subBranch"
            placeholder="Select"
            style="width: 240px"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select> -->
      </el-form-item>
      <el-form-item label="寺庙名称">
        <el-input
          v-model="searchForm.placeName"
          placeholder="请输入(选填)"
          clearable
        />
      </el-form-item>
    </el-form>
    <div class="time-scroll__list">
      <el-table :data="buddhismList" style="width: 100%">
        <el-table-column type="index" width="50" />
        <el-table-column prop="placeName" label="寺庙名称" width="180" />
        <el-table-column prop="personCharge" label="负责人" width="180" />
        <el-table-column prop="religionName" label="宗派名称" width="180" />
        <el-table-column prop="subBranch" label="分支名称" />
        <el-table-column prop="address" label="地址"> </el-table-column>
        <el-table-column prop="address" label="创建时间" />
      </el-table>
    </div>
    <!-- <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 50]"
      :small="false"
      :disabled="false"
      :background="true"
      layout="total, sizes,prev, pager, next,jumper"
      :total="total"
      @size-change="getBuddhismList"
      @current-change="getBuddhismList"
    /> -->
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from "vue";
import {
  getBuddhismListApi,
  getBuddhismProvinceApi,
  getBuddhismCityApi,
  getBuddhismTownApi,
} from "@/api/common";
import type { CascaderProps } from "element-plus";

const religionOptions = [
  { label: "全部", value: "" },
  { label: "道教", value: "道教" },
  { label: "佛教", value: "佛教" },
];
const branchOptions1 = [
  { label: "全部", value: "" },
  { label: "全真", value: "全真" },
  { label: "正一", value: "佛教" },
];
const branchOptions2 = [
  { label: "全部", value: "" },
  { label: "汉语系", value: "汉语系" },
  { label: "藏语系", value: "藏语系" },
  { label: "巴利语系", value: "巴利语系" },
];
const currentPage = ref(1);
// const pageSize = ref(10);
// const total = ref(0);
const buddhismList = ref([]);
const searchForm = reactive({
  religionName: "",
  subBranch: "",
  provinceName: "",
  cityName: "",
  townName: "",
  placeName: "",
});

const props: CascaderProps = {
  lazy: true,
  async lazyLoad(node, resolve) {
    const { level, label } = node;
    if (level === 0) {
      const res = await getBuddhismProvinceApi();
      const list = (res.data || []).map((item) => ({
        ...item,
        value: item.provinceName,
        label: item.provinceName,
        leaf: false,
      }));
      return resolve(list);
    }
    if (level === 1) {
      const res = await getBuddhismCityApi({
        provinceName: label,
      });
      const list = (res.data || []).map((item) => ({
        ...item,
        value: item.cityName,
        label: item.cityName,
        leaf: false,
      }));
      return resolve(list);
    }
    if (level === 2) {
      const res = await getBuddhismTownApi({
        cityName: label,
      });
      const list = (res.data || []).map((item) => ({
        ...item,
        value: item.townName,
        label: item.townName,
        leaf: true,
      }));
      return resolve(list);
    }
    resolve([]);
  },
};
const branchOptions = computed(() => {
  if (searchForm.religionName === "道教") {
    return [
      { label: "全部", value: "" },
      { label: "全真", value: "全真" },
      { label: "正一", value: "佛教" },
    ];
  }
  if (searchForm.religionName === "佛教") {
    return [
      { label: "全部", value: "" },
      { label: "汉语系", value: "汉语系" },
      { label: "藏语系", value: "藏语系" },
      { label: "巴利语系", value: "巴利语系" },
    ];
  }
  return [
    { label: "全真", value: "全真" },
    { label: "正一", value: "佛教" },
    { label: "汉语系", value: "汉语系" },
    { label: "藏语系", value: "藏语系" },
    { label: "巴利语系", value: "巴利语系" },
  ];
});

const provinceCgange = (value: any) => {
  searchForm.provinceName = value[0];
  searchForm.cityName = value[1];
  searchForm.townName = value[2];
};

const getBuddhismList = async () => {
  const res: any = await getBuddhismListApi({
    provinceName: searchForm.provinceName,
    cityName: searchForm.cityName,
    townName: searchForm.townName,
    religionName: searchForm.religionName,
    placeName: searchForm.placeName,
    subBranch: searchForm.subBranch,
    page: currentPage.value,
  });
  if (res.code === 0) {
    buddhismList.value = res.data || [];
  }
};

onMounted(() => {
  getBuddhismList();
});
</script>
<style lang="scss" scoped>
.buddhism-search {
  &__form-full {
    width: 100%;

    ::v-deep .el-form-item__content {
      width: 100% !important;
    }
  }
}
</style>
