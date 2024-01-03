<template>
  <div class="time-table">
    <div class="time-table__tabs">
      <span
        v-for="(item, index) in tabs"
        :key="index"
        class="time-table__tab"
        :class="{ active: active === item.value }"
        @click="switchTab(item.value)"
      >{{ item.label }}</span>
    </div>
    <div class="time-table__table" v-loading="isLoading">
      <div class="time-table__top">
        <span class="time-table__top-title">人物概览</span>
        <div class="time-table__top-legends">
          <div class="time-table__top-legend">
            <span class="time-table__top-legend-color weight1"></span>1-5
          </div>
          <div class="time-table__top-legend">
            <span class="time-table__top-legend-color weight1"></span>5-20
          </div>
          <div class="time-table__top-legend">
            <span class="time-table__top-legend-color weight3"></span>20-100
          </div>
          <div class="time-table__top-legend">
            <span class="time-table__top-legend-color weight4"></span>100+
          </div>
        </div>
      </div>
      <div class="time-table__content">
        <el-table
          :data="tableData"
          style="width: 100%;height: 562px;"
          header-row-class-name="time-table__table-header-row"
          row-class-name="time-table__table-row"
          cell-class-name="time-table__table-cell"
          v-el-table-infinite-scroll="loadMore"
          :infinite-scroll-disabled="isLoading"
        >
          <el-table-column fixed prop="userName" label="" :width="active === 2 ? 120 : 61" align="center">
            <template #default="{ row }">
              <div class="time-table__table-ellipsis" :title="row.userName">{{ row.userName }}</div>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in tableColumns"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            min-width="57"
            align="center"
          >
            <template  #default="{ row }">
              <span
                class="time-table__top-legend-color"
                :class="{
                  weight1: row[item.prop] <= 5,
                  weight2: row[item.prop] > 5 && row[item.prop] <= 20,
                  weight3: row[item.prop] > 20 && row[item.prop] <= 100,
                  weight4: row[item.prop] > 100,
                }"
              >{{ row[item.prop] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            prop="total"
            label="合计"
            align="center" />
        </el-table>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  getListPersonBoardApi,
  getEventIndividualBoardApi,
  getEventAddressBoardApi
} from '@/api/common'
import { onMounted, ref } from 'vue'
import { default as vElTableInfiniteScroll } from "el-table-infinite-scroll";

interface Props {
  start: number
  end: number
}

const props = withDefaults(defineProps<Props>(), {
  start: 0,
  end: 0
})

const isLoading = ref(false)
const tableColumns = ref([])
const tableData = ref([])
const active = ref(1)
const tabs = [
  { label: '人物事件关系', value: 1 },
  { label: '事件标签关系', value: 2 },
  { label: '事件地址关系', value: 3 }
]
const pageNumber = ref(1)

const loadMore = () => {
  pageNumber.value++
  getData(true)
}

const switchTab = (index = 1) => {
  if (active.value === index) return
  active.value = index
  pageNumber.value = 1
  getData()
}

const getData = (isLoadMore = false) => {
  if (active.value === 1) {
    getListPersonBoard()
  }

  if (active.value === 2  && !isLoadMore) {
    getEventIndividualBoard()
  }

  if (active.value === 3) {
    getEventAddressBoard()
  }
}

// 处理数据
const makeData = (res: any = {}, field = 'userName') => {
  const list = res.data || []
  let data = []
  list.forEach((item, i) => {
    data[i] = {}
    data[i].userName = item[field]
    data[i].total = item.totalCnt
    item.voList.forEach((curr) => {
      data[i][`${curr.year}_${curr.year - props.start}`] = curr.cnt
    })
  })
  if (active.value === 1 || active.value === 3) {
    // 分页
    tableData.value = tableData.value.concat(data)
    return
  }
  tableData.value = data
}

// 历史时间轴看板页面人物概览-人物事件关系
const getListPersonBoard = async () => {
  isLoading.value = true
  const res: any = await getListPersonBoardApi({
    startYear: props.start,
    endYear: props.end,
    pageSize: 20,
    pageNum: pageNumber.value
  })
  if (res.code === 0) {
    makeData(res, 'userName')
  }
  isLoading.value = false
}

// 历史时间轴看板页面事件标签概览-事件标签关系
const getEventIndividualBoard = async () => {
  isLoading.value = true
  const res: any = await getEventIndividualBoardApi({
    startYear: props.start,
    endYear: props.end
  })
  if (res.code === 0) {
    makeData(res, 'individualName')
  }
  isLoading.value = false
}

// 历史时间轴看板页面事件地址概览-事件地址关系
const getEventAddressBoard = async () => {
  isLoading.value = true
  const res: any = await getEventAddressBoardApi({
    startYear: props.start,
    endYear: props.end,
    pageSize: 20,
    pageNum: pageNumber.value
  })
  if (res.code === 0) {
    makeData(res, 'eventAddress')
  }
  isLoading.value = false
}

const generatorColumns = () => {
  let columns = []
  for (let i = props.start; i < props.end; i++) {
    columns.push({
      prop: `${i}_${i - props.start}`,
      label: `${i}`
    })
  }
  tableColumns.value = columns
}
onMounted(() => {
  generatorColumns()
  switchTab()
})
</script>
<style lang="scss" scoped>
.time-table {
  &__tabs {
    padding: 51px 0 18px;
    font-size: 0;
  }

  &__tab {
    display: inline-block;
    width: 122px;
    height: 40px;
    margin-right: 3px;
    text-align: center;
    line-height: 40px;
    border: 1px solid #6D6A63;
    font-size: 16px;
    color: #6D6A63;
    cursor: pointer;
    border-radius: 4px;
    background: #FCF9F1;

    &.active,
    &:hover {
      color: #fff;
      background: #6D6A63;
    }
  }

  &__table {
    width: 1200px;
    height: 639px;
    padding: 22px 11px 25px;
    background: #FFFFFF;
    border-radius: 4px;
    box-sizing: border-box;

    &-ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    &-title {
      font-size: 16px;
      font-family: Microsoft YaHei;
      color: #6D6A63;
    }

    &-legends {
      display: flex;
    }

    &-legend {
      display: inline-flex;
      align-items: center;
      margin-right: 29px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #6D6A63;

      &:last-child {
        margin-right: 0;
      }

      &-color {
        display: block;
        width: 30px;
        height: 16px;
        margin-right: 11px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        color: #6D6A63;
        line-height: 16px;
        text-align: center;
        
        &.weight1 {
          background: #FFECB8;
        }

        &.weight2 {
          background: #FFCA3D;
        }

        &.weight3 {
          background: #FF9C00;
        }

        &.weight4 {
          background: #FF4F18;
        }
      }
    }
  }

  &__content {
    display: flex;
    justify-content: space-between;

    &-left {
      flex-shrink: 0;
      width: 61px;
      background: #897F63;

      &-item {
        
      }
    }

    &-center {
      flex: 1;
    }

    &-right {
      flex-shrink: 0;
      width: 58px;
      box-sizing: border-box;
      border-left: 1px solid #EAEAEA;
    }
  }
}
</style>
<style lang="scss">
.time-table {
  .time-table__table-header-row {
    
    .el-table__cell {
      background: #A49A7F;
      font-size: 14px;
      font-family: Microsoft YaHei;
      color: #FFFFFF;
      font-weight: 400;
      border: none !important;

      &:first-child {
        background: #897F63;
        border: none !important;

        &::before {
          content: '';
          position: absolute;
          width: 62px;
          height: 40px;
          background: #897F63;
          top: 0;
          left: 0;
        }
      }

      &:last-child {
        background: #A49A7F;
        border-left: 1px solid #EAEAEA !important;
        border-right: 1px solid #EAEAEA !important;
      }
    }
  }

  .time-table__table-row {
    .el-table__cell:first-child {
      background: #897F63;
      font-size: 14px;
      font-family: Microsoft YaHei;
      color: #FFFFFF;
      border-bottom: 1px solid #897F63;
    }

    .el-table__cell:last-child {
      border-left: 1px solid #EAEAEA;
      border-right: 1px solid #EAEAEA;
    }

    .cell {
      padding: 0 8px;
    }
  }
}
</style>
