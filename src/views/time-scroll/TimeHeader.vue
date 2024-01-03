<template>
  <div class="time-header">
    <!-- flex布局 勿删 -->
    <span></span>
    <div class="time-header__tab">
      <div>
        <span class="time-header__tab-text">视角选择</span>
        <span
          v-for="(item, index) in tabs"
          :key="index"
          class="time-header__tab-item"
          :class="{ active: item.value === active }"
          @click="switchTab(item.value)"
        >
          {{ item.label }}
        </span>
      </div>
      <!-- <el-button
        class="time-header__export"
        color="#6D6A63"
        @click="showExport"
      >
        <img class="time-header__export-img" src="../../assets/time-export.png" />
        数据导出
      </el-button> -->
    </div>
  </div>
  <el-dialog
    v-model="isShowExportDialog"
    title="数据导出"
    width="680"
    :close-on-click-modal="false"
    modal-class="time-scroll__export-modal"
    :show-close="false"
    append-to-body
    align-center
  >
    <el-form :model="exportParams" label-width="120px">
      <el-form-item label="范围：">{{ exportParams.range }}</el-form-item>
      <el-form-item label="元素：">
        <el-radio-group v-model="exportParams.element">
          <el-radio class="time-scroll__export-modal-item" :label="1">事件</el-radio>
          <el-radio class="time-scroll__export-modal-item" :label="2">作品</el-radio>
          <el-radio class="time-scroll__export-modal-item" :label="3">关系</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="筛选：">
        <el-checkbox
          v-model="isCheckAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
          >全选</el-checkbox
        >
        <el-checkbox-group
          v-model="exportParams.filterOptions"
          @change="handleCheckedChange"
        >
          <el-checkbox
            v-for="(item, index) in filterOptions"
            :key="index"
            :label="item.value"
            class="time-scroll__export-modal-item">{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div>
        <el-button
          color="#6D6A63"
          plain
          class="time-scroll__export-modal-button"
          size="large"
          @click="closeExport">取消</el-button>
        <el-button
          type="primary"
          color="#6D6A63"
          class="time-scroll__export-modal-button"
          size="large"
          @click="confirmExport">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue'
import {
  getYearByDynastyApi,
  getYearByEmperorApi,
  getYearByNianHaoApi
} from '@/api/common'

interface Props {
  filterOptions?: any[]
  start: number
  end: number
  loading: boolean
}

const props = withDefaults(defineProps<Props>(), {
  filterOptions: () => [],
  start: 0,
  end: 0,
  loading: false
})

const emits = defineEmits(['switch'])

// 视角
const tabs = [
  { label: '朝代', value: 0 },
  { label: '皇帝', value: 1 },
  { label: '年号', value: 2 }
]

const exportParams = reactive({
  range: '620年-680年',
  element: 1,
  filterOptions: []
})

const active = ref(0)
const isShowExportDialog = ref(false)
const isCheckAll = ref(false)
const isIndeterminate = ref(false)

// 全选
const handleCheckAllChange = (val ) => {
  exportParams.filterOptions = val ? props.filterOptions.map((item) => item.value) : []
  isIndeterminate.value = false
}

const handleCheckedChange = (value: number[]) => {
  const checkedCount = value.length
  isCheckAll.value = checkedCount === props.filterOptions.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < props.filterOptions.length
}

const closeExport = () => {
  isShowExportDialog.value = false
}

const showExport = () => {
  isShowExportDialog.value = true
}

const confirmExport = () => {
  isShowExportDialog.value = false
}

// 根据朝代列出年份信息
const getYearByDynasty = async () => {
  try {
    const res: any = await getYearByDynastyApi({
      startYear: props.start,
      endYear: props.end
    })
    if (res.code === 0) {
      const data = res.data.map((item) => ({
        label: item.dynasty,
        start: item.minYear,
        end: item.maxYear
      }))
      emits('switch', data)
    } else {
      emits('switch', [])
    }
  } catch(err) {
    emits('switch', [])
  }
}

// 根据皇帝列出年份信息
const getYearByEmperor = async () => {
  try {
    const res: any = await getYearByEmperorApi({
      startYear: props.start,
      endYear: props.end
    })
    if (res.code === 0) {
      const data = res.data.map((item) => ({
        label: item.emperor,
        start: item.minYear,
        end: item.maxYear
      }))
      emits('switch', data)
    } else {
      emits('switch', [])
    }
  } catch(err) {
    emits('switch', [])
  }
}

// 根据年号列出年份信息
const getYearByNianHao = async () => {
  try {
    const res: any = await getYearByNianHaoApi({
      startYear: props.start,
      endYear: props.end
    })
    if (res.code === 0) {
      const data = res.data.map((item) => ({
        label: item.nianHao,
        start: item.minYear,
        end: item.maxYear
      }))
      emits('switch', data)
    } else {
      emits('switch', [])
    }
  } catch(err) {
    emits('switch', [])
  }
}

const apis = [getYearByDynasty, getYearByEmperor, getYearByNianHao]
const switchTab = (value) => {
  active.value = value
  apis[value]()
}

watch(() => props.loading, (val) => {
  if (val) {
    switchTab(0)
  }
})

onMounted(() => {
  switchTab(0)
})
</script>
<style lang="scss" scoped>
.time-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 11px;
  font-size: 18px;
  color: #6D6A63;

  &__tab {
    display: inline-flex;

    &-text {
      margin-right: 13px;
      font-size: 16px;
      color: #6D6A63;
    }

    &-item {
      display: inline-block;
      margin-right: 9px;
      width: 80px;
      height: 30px;
      border: 1px solid #6D6A63;
      text-align: center;
      line-height: 30px;
      cursor: pointer;
      border-radius: 4px;
      color: #6D6A63;
      font-size: 14px;

      &.active,
      &:hover {
        background: #6D6A63;
        color: #fff;
      }
    }
  }

  &__export {
    margin-left: 66px;

    &-img {
      width: 16px;
      margin-right: 5px;
    }
  }
}
</style>
<style lang="scss">
.time-scroll__export-modal {
  .el-dialog__header {
    margin-right: 0;
    padding: 0;
    height: 60px;
    line-height: 60px;
    background: rgba(194, 181, 148, 0.2);
    font-size: 20px;
    color: #6D6A63;
    text-align: center;
  }

  .el-dialog__footer {
    padding: 13px 0;
    text-align: center;
    border-top: 1px solid #DDDDDD;
  }

  &-button {
    width: 180px;

    &:last-child {
      margin-left: 68px;
    }
  }
  &-item {
    width: 130px;
    margin: 0;
  }
}
</style>
