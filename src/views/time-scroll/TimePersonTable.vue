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
    <div v-if="active === 1" class="time-table__table" v-loading="isLoading">
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
        >
          <el-table-column fixed prop="userName" label="" width="61" align="center">
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
    <div v-if="active === 2" class="time-table__table" v-loading="isLoading">
      <div v-if="!isLoading" class="time-table__content">
        <!-- 单词 -->
        <time-bar
          class="time-table__content-bar"
          :data="singleWordData"
          id="timebarChartSingle"
          :title="`${personName}使用的TOP100词语的使用次数/优势比例`"
        ></time-bar>
        <!-- 多词 -->
        <time-bar
          class="time-table__content-bar"
          :data="doubleWordData"
          id="timebarChartDouble"
          :title="`${personName}使用的TOP100词语的使用次数/优势比例`"
        ></time-bar>
      </div>
    </div>
    <div v-if="active === 3" class="time-table__table" v-loading="isLoading">
      <div v-if="!isLoading" class="time-table__content">
        <!-- 单词 -->
        <time-bar
          class="time-table__content-bar"
          :data="singleWordYearData"
          id="timebarChartYearSingle"
          :title="`${personName}使用的TOP100词语的进度比例`"
        ></time-bar>
        <!-- 多词 -->
        <time-bar
          class="time-table__content-bar"
          :data="doubleWordYearData"
          id="timebarChartYearDouble"
          :title="`${personName}使用的TOP100词语的进度比例`"
        ></time-bar>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  getEventRelPersonBoardApi,
  getFenCiStaticsApi,
  getFenCiAgeStyleBoardApi,
} from '@/api/common'
import { onMounted, ref } from 'vue'
import JSONBig from 'json-bigint'
import TimeBar from './TimeBar.vue'

interface Props {
  start: number
  end: number
  personId: any
  personName: string
}

const props = withDefaults(defineProps<Props>(), {
  start: 0,
  end: 0,
  personId: '',
  personName: ''
})

const isLoading = ref(false)
const tableColumns = ref([])
const tableData = ref([])
const active = ref(1)
const tabs = [
  { label: '互动关系', value: 1 },
  { label: '分词词频统计', value: 2 },
  { label: '年龄风格统计', value: 3 }
]
const singleWordData = ref({})
const doubleWordData = ref({})
const singleWordYearData = ref({})
const doubleWordYearData = ref({})

const switchTab = (index = 1) => {
  if (active.value === index) return
  active.value = index
  getData()
}

const getData = () => {
  if (active.value === 1) {
    getEventRelPersonBoard()
  }

  if (active.value === 2) {
    getFenCiStatics()
  }

  if (active.value === 3) {
    getFenCiAgeStyleBoard()
  }
}

// 处理数据
const makeData = (res: any = {}, field = 'userName') => {
  const list = res.data || []
  let data = []
  list.forEach((item, i) => {
    data[i] = {}
    data[i].userName = item[field]
    data[i].total = item.cnt
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

// 个人时间轴轴看板页需求--互动关系
const getEventRelPersonBoard = async () => {
  isLoading.value = true
  const res: any = await getEventRelPersonBoardApi({
    bnPersonId: JSONBig.stringify(props.personId)
  })
  if (res.code === 0) {
    makeData(res, 'userName')
  }
  isLoading.value = false
}

// 个人轴看板--分词词频统计
const getFenCiStatics = async () => {
  isLoading.value = true
  const res: any = await getFenCiStaticsApi({
    personName: props.personName
  })
  if (res.code === 0) {
    const list = res.data || {}
    const danci =  {x: [], y1: [], y2: [], tip1: '使用词数', tip2: '优势比'}
    const duoci =  {x: [], y1: [], y2: [], tip1: '使用词数', tip2: '优势比'}
    list.left.forEach((item) => {
      danci.x.push(item.ci)
      danci.y1.push(item.usedCnt)
      danci.y2.push(item.advantage)
    })
    list.middle.forEach((item) => {
      duoci.x.push(item.ci)
      duoci.y1.push(item.usedCnt)
      duoci.y2.push(item.advantage)
    })
    singleWordData.value = danci
    doubleWordData.value = duoci
  }
  isLoading.value = false
}

// 个人轴看板--年龄风格统计
const getFenCiAgeStyleBoard = async () => {
  isLoading.value = true
  const res: any = await getFenCiAgeStyleBoardApi({
    personName: props.personName
  })
  if (res.code === 0) {
    const list = res.data || {}
    const danci =  {x: [], y1: [], y2: [], tip1: '进度比例'}
    const duoci =  {x: [], y1: [], y2: [], tip1: '进度比例'}
    list.oneWordList.forEach((item) => {
      danci.x.push(item.word)
      danci.y1.push(item.ratio)
    })
    list.multipleWordList.forEach((item) => {
      duoci.x.push(item.word)
      duoci.y1.push(item.ratio)
    })
    singleWordYearData.value = danci
    doubleWordYearData.value = duoci
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
  getData()
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

    &-bar {
      width: 50%;
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
