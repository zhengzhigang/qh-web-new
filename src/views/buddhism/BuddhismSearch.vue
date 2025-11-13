<template>
  <div class="buddhism-search">
    <el-affix :offset="0">
      <el-form :inline="true" :model="searchForm" label-width="auto" style="background-color: #fff;padding-top: 10px;">
        <el-form-item label="宗教名称">
          <el-select v-model="searchForm.religionName" placeholder="请选择" @change="searchList">
            <el-option
              v-for="item in religionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分支名称">
          <el-select v-model="searchForm.subBranch" placeholder="请选择" @change="searchList">
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
            @input="handleInput"
          />
        </el-form-item>
      </el-form>
    </el-affix>
    <div v-loading="loading" class="time-scroll__list">
      <el-table :data="buddhismList" style="width: 100%">
        <el-table-column type="index" width="50" />
        <el-table-column prop="placeName" label="寺庙名称" width="180" />
        <el-table-column prop="personCharge" label="负责人" width="120" />
        <el-table-column prop="religionName" label="宗派名称" width="180" align="center" />
        <el-table-column prop="subBranch" label="分支名称" align="center" />
        <el-table-column prop="address" label="地址"  width="240"> </el-table-column>
        <el-table-column prop="address" label="创建时间" width="190"  align="center">
          <template v-slot="{row}">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
      </el-table>
      <div class="buddhism-search__pagination">
        <el-button type="primary" :disabled="currentPage <= 1" @click="prev">上一步</el-button>
        <el-button type="primary" :disabled="buddhismList.length < 20" @click="next">下一步</el-button>
      </div>
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
import { debounce, template } from 'lodash-es'

const religionOptions = [
  { label: "全部", value: "" },
  { label: "道教", value: "道教" },
  { label: "佛教", value: "佛教" },
];
const loading = ref(false)
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
      return resolve([
        {
        value: '',
        label: '全省',
        leaf: true,
        },
        ...list
      ]);
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
      return resolve([
        {
        value: '',
        label: '全市',
        leaf: true,
        },
        ...list
      ]);
    }
    resolve([]);
  },
};
const branchOptions = computed(() => {
  if (searchForm.religionName === "道教") {
    return [
      { label: "全部", value: "" },
      { label: "全真", value: "全真" },
      { label: "正一", value: "正一" },
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
    { label: "正一", value: "正一" },
    { label: "汉语系", value: "汉语系" },
    { label: "藏语系", value: "藏语系" },
    { label: "巴利语系", value: "巴利语系" },
  ];
});

const formatTime = (arr: number[]) => {
  if (!arr || !arr.length) return ''
  const [year, month, day, hour, minute, second] = arr;
  return `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")} ${hour ? hour.toString().padStart(2, "0") : "00"}:${
    minute ? minute.toString().padStart(2, "0") : "00"
  }:${second ? second.toString().padStart(2, "0") : "00"}`;
};

const provinceCgange = (value: any) => {
  searchForm.provinceName = value[0];
  searchForm.cityName = value[1];
  searchForm.townName = value[2];
  searchList()
};

const debouncedSearch = debounce((value) => {
  console.log('执行搜索或请求:', value)
  currentPage.value = 1
  getBuddhismList()
}, 500)

// 输入事件处理器
const handleInput = (value) => {
  debouncedSearch(value)
}

const prev = () => {
  currentPage.value -= 1
  getBuddhismList()
}

const next = () => {
  currentPage.value += 1
  getBuddhismList()
}

const searchList = () => {
  currentPage.value = 1
  getBuddhismList()
}

const getBuddhismList = async () => {
  try {
    loading.value = true
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
    } else {
      buddhismList.value = []
    }
    loading.value = false
  } catch(_) {
    buddhismList.value = []
    loading.value = false
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

  &__pagination {
    display: flex;
    gap: 10px;
    padding-top: 10px;
    justify-content: center;
  }
}
</style>
