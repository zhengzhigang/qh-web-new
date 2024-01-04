<template>
  <div class="time-scroll wrapper bg-white">
    <div class="header h-220px">
      <Header :type="3"></Header>
    </div>
    <div
      class="time-scroll__main"
      v-loading.fullscreen.lock="state.loading"
      element-loading-text="加载中、请稍候..."
      element-loading-background="rgba(216, 207, 180, 0.4)"
    >
      <time-tabs :active="0"></time-tabs>
      <time-search
        :historicalEventOptions="state.historicalEventOptions"
        :personalEventOptions="state.personalEventOptions"
        :worksOptions="state.worksOptions"
        timeType="history"
        @search="search"
      ></time-search>
      <!-- 落地页 -->
      <div
        v-if="!state.isSearch"
        style="margin-top: -40px; margin-bottom: 75px"
      >
        <time-data-summary></time-data-summary>
        <div class="time-scroll__land">
          <div class="time-scroll__land-item">
            <time-pie></time-pie>
          </div>
          <div class="time-scroll__land-item">
            <time-wordcloud></time-wordcloud>
          </div>
        </div>
        <time-smooth-line title="各年份事件/作品数"></time-smooth-line>
      </div>
      <!-- 时间轴 -->
      <div v-if="state.isSearch" class="time-scroll__content">
        <time-header
          :loading="state.loading"
          :start="state.rulerData.start"
          :end="state.rulerData.end"
          @switch="switchAngel"
        ></time-header>
        <div class="time-scroll__content-main" id="timeContnet">
          <!-- 事件轨道 -->
          <time-card
            v-for="(item, index) in state.eventsList"
            :key="index"
            :data="item.list"
            :importantList="item.importantList"
            :title="item.title"
            :type="item.type"
            :tabIndex="0"
            :personId="state.personId"
          ></time-card>
          <time-card
            :data="state.individualEvent.list"
            :importantList="state.individualEvent.importantList"
            :title="state.individualEvent.title"
            :type="5"
            :tabIndex="0"
            :personId="state.personId"
          ></time-card>

          <!-- 视角 -->
          <time-dynasty
            v-if="state.angleViewData.length"
            :dynastyList="state.angleViewData"
            :start="state.rulerData.start"
            :end="state.rulerData.end"
          ></time-dynasty>

          <!-- 标尺 -->
          <time-ruler
            :lineX="state.lineX"
            :data="state.rulerData"
            :scale="state.scale"
          ></time-ruler>

          <!-- 作品轨道 -->
          <time-card
            v-for="(item, index) in state.worksList"
            :key="index"
            :data="item.list"
            :title="item.title"
            :type="item.type + 5"
          ></time-card>
          <div
            v-show="state.isShowLine"
            class="time-scroll__content-line"
            :style="{ left: `${state.lineX - 2}px` }"
          ></div>
        </div>
      </div>
      <time-table
        v-if="state.isSearch && !state.loading"
        :start="state.timeData.startYear"
        :end="state.rulerData.end"
        style="margin-bottom: 75px"
      ></time-table>
    </div>
    <Footer></Footer>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onBeforeUnmount, nextTick } from "vue"
import {
  getHistoryEventListApi,
  getIndividualEventListApi,
  getPostListApi,
  getHistoryStaticsApi
} from "@/api/common"
import Header from "@/components/headerNew.vue"
import Footer from "@/components/footer.vue"
import TimeTabs from "./TimeTabs.vue"
import TimeSearch from "./TimeSearch.vue"
import TimeHeader from "./TimeHeader.vue"
import TimeLine from "./TimeLine.vue"
import TimeDynasty from "./TimeDynasty.vue"
import TimeRuler from "./TimeRuler.vue"
import TimeDataSummary from "./TimeDataSummary.vue"
import TimeRelation from "./TimeRelation.vue"
import TimeCard from "./TimeCard.vue"
import TimePie from "./TimePie.vue"
import TimeWordcloud from "./TimeWordcloud.vue"
import TimeSmoothLine from "./TimeSmoothLine.vue"
import TimeTable from "./TimeTable.vue"
import { HistoryParams } from "./time-scroll"

let timeContnet = null

const state = reactive<{
  timeData: HistoryParams
  [key: string]: any
}>({
  isSearch: false,
  loading: false,
  isShowLine: false,
  scale: 2, // 间隔
  lineX: 0, // 时间线的x轴坐标
  offsetLeft: 0, // 时间轴区域元素的offsetLeft值的和
  historicalEventOptions: [], // 历史事件选项
  personalEventOptions: [], // 个人事件选项
  worksOptions: [], // 作品选项
  summaryData: {}, // 落地页数据
  timeData: {
    personName: "",
    // 时间范围 618-1014
    startYear: 618,
    endYear: 1014,
    postTypeList: [],
    historyEventTypeList: [],
    individualEventTypeList: [],
  },
  rulerData: {
    start: 0,
    end: 0,
    events: [],
  },
  individualEvent: {}, // 人物经历
  eventsList: [], // 历史事件
  worksList: [], // 作品事件
  angleViewData: [],
  personId: "",
})

// 搜索
const search = async (params: HistoryParams) => {
  state.timeData = params
  state.eventsList = []
  state.worksList = []
  state.individualEvent = {}
  getHistoryStatics(params)
}

const getTimeContnetRect = () => {
  const rect = timeContnet.getBoundingClientRect()
  state.offsetLeft = rect.left
}

// 获取历史事件类型
const getHistoryEventList = async () => {
  const res: any = await getHistoryEventListApi()
  if (res.success) {
    state.historicalEventOptions = res.data
  }
}

// 获取个人事件类型
const getIndividualEventList = async () => {
  const res: any = await getIndividualEventListApi()
  if (res.success) {
    state.personalEventOptions = res.data
  }
}

// 获取编年史作品类型
const getPostList = async () => {
  const res: any = await getPostListApi()
  if (res.success) {
    state.worksOptions = res.data
  }
}

// 获取历史时间轴页面数据
const getHistoryStatics = async (params) => {
  state.loading = true
  const res: any = await getHistoryStaticsApi(params)
  if (res.success) {
    const data = res.data.map
    state.scale = res.data.scale
    state.timeData.historyEventTypeList.forEach((item, index) => {
      state.eventsList.push({
        type: index + 1,
        title: item,
        list: data[item],
        importantList: data[`${item}||important`] || [], // 重大事件
      })
    })
    state.timeData.postTypeList.forEach((item, index) => {
      state.worksList.push({
        type: index + 1,
        title: item,
        list: data[item],
        importantList: data[`${item}||important`] || [], // 重大事件
      })
    })
    state.individualEvent = {
      type: 5,
      title: "人物经历",
      list: data.individualEvent,
    }
    // 设置标尺的开始结束时间
    const start = data.individualEvent[0].year
    const end = data.individualEvent[data.individualEvent.length - 1].year
    // state.rulerData.start = start % 2 === 1 ? start - 1 : start
    // state.rulerData.end = end % 2 ===1 ? end + 1 : end
    state.rulerData.start = start
    state.rulerData.end = end
  }
  state.loading = false

  // 搜索，不再展示落地页
  state.isSearch = true
  nextTick(() => {
    initLine()
  })
}

// 鼠标移动，拿到当前鼠标停留在哪一年
const moveTimeLine = (event) => {
  const x = event.clientX - state.offsetLeft
  if (x - 49 < 0 || x - 49 > 1052) {
    state.isShowLine = false
  } else {
    state.lineX = x
    state.isShowLine = true
  }
}

// 初始化鼠标线
const initLine = () => {
  timeContnet = document.getElementById("timeContnet")
  if (timeContnet) {
    getTimeContnetRect()
    timeContnet.addEventListener("mousemove", moveTimeLine)
    window.addEventListener("resize", getTimeContnetRect)
  }
}

// 设置视角数据
const switchAngel = (data) => {
  state.angleViewData = data
}

onMounted(() => {
  getHistoryEventList()
  getIndividualEventList()
  getPostList()
})

onBeforeUnmount(() => {
  timeContnet.removeEventListener("mousemove", moveTimeLine)
  window.removeEventListener("resize", getTimeContnetRect)
})
</script>
<style lang="less" scoped>
.time-scroll {
  background: #fcf9f1;

  &__main {
    position: relative;
    margin: -352px 0 0 50%;
    transform: translate(-50%);
    width: 1200px;
    background-repeat: repeat-y;
    background-position: center;
    background-size: 1150px auto;
    border-radius: 5px;
  }

  &__content {
    position: relative;
    padding: 13px;
    margin-top: -40px;
    border-radius: 4px;
    z-index: 1;
    background: #fff;

    &-main {
      position: relative;
    }

    &-line {
      position: absolute;
      top: 52px;
      bottom: 52px;
      width: 1px;
      z-index: 1;
      background: #6d6a63;
    }
  }

  &__land {
    display: flex;
    justify-content: space-between;
    margin-bottom: 26px;

    &-item {
      width: 588px;
    }
  }
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.btn {
  color: #409eff;
  cursor: pointer;
}
.el-input-group__append,
.el-input-group__prepend {
  padding: 0 !important;
}
.progressBox {
  position: relative;
  .userName {
    position: absolute;
    top: -24px;
    left: 0;
    white-space: nowrap;
  }
}
.left {
  position: fixed;
  top: 230px;
  left: 140px;
  width: 50px;
  height: 50px;
  animation: fadeIn 1.5s ease-in-out;
}
.right {
  position: fixed;
  top: 230px;
  right: 140px;
  width: 50px;
  height: 50px;
  animation: fadeIn 1.5s ease-in-out;
}
.pointer {
  cursor: pointer;
}
:deep(.el-tag.el-tag--info) {
  --el-tag-bg-color: #f5f5f5;
  --el-tag-text-color: #2c3d50;
}
:deep(.el-tag) {
  padding: 13px 17px;
  font-size: 14px;
  height: 34px;
  margin-bottom: 15px;
}
.borderRadius {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}
.borderLeftRadius {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
.describe {
  position: absolute;
  margin-top: 46px;
  text-align: right;
  height: 26px;
  font-size: 18px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #2c3d50;
  line-height: 25px;
  border-left: none;
}
.progress {
  position: absolute;
  margin-top: 55px;
  height: 8px;
  background: linear-gradient(302deg, #c867ff 0%, #a468e2 100%);
  border-radius: 4px;
  z-index: 1;
}
.wrapper {
  .header {
    height: 440px;
    background: url("@/assets/bj.png");
    background-size: 100% auto;
    background-repeat: no-repeat;
  }
  .searchname {
    margin: 0 40px;
    padding: 35px 40px 13px 40px;
  }
  .mian {
    position: relative;
    margin-top: -310px;
    margin: -310px 0 0 50%;
    padding: 37px 0 43px 0;
    transform: translate(-50%);
    width: 1140px;
    background-image: url("../../assets/timeBj.png");
    background-repeat: repeat-y;
    background-position: center;
    background-size: 1150px auto;
    border-radius: 5px;
    .timeScroll {
      margin: 0 40px;
      padding: 35px 40px 13px 40px;
      width: 1060px;
      background-color: #fefefd;
      border-radius: 5px;
      overflow: hidden;
      .table {
        width: 980px;
        overflow: hidden;
        position: relative;
        #header {
          position: relative;
          display: flex;
          padding: 0 0 6px 0;
          height: 25px;
          // > :not(:first-child) {
          //     transform: translateX(-20px);
          //   }
          .scale {
            display: flex;
            position: absolute;
            top: 26px;
            height: 2px;
            width: 100%;
            li {
              position: relative;
              height: 2px;
              p {
                position: absolute;
                top: -3px;
                right: 0px;
                width: 1px;
                height: 100%;
                color: #aea68d;
                font-size: 12px;
              }
            }
          }
          div {
            width: 216px;
            height: 25px;
            p {
              width: 40px;
              height: 25px;
              font-size: 18px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #aea68d;
              line-height: 25px;
            }
          }
        }
        #border {
          width: 980px;
          height: 2px;
          background: linear-gradient(90deg, #eee9db 0%, #c7c1b0 100%);
        }
        ul {
          li {
            display: flex;
            height: 60px;
            width: 980px;
            border-top: 1px solid rgba(216, 207, 180, 0.4);
            div {
              position: relative;
              flex-shrink: 0;
              height: 100%;
              width: 216px;
              border-left: 1px dashed #d8cfb4;
              overflow: hidden;
            }
          }
        }
      }
    }
    .noData {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-family: PingFangSC-Regular, PingFang SC;
    }
  }
  .nav {
    span {
      margin: 0 20px;
      color: #333;
      font-size: 18px;
      cursor: pointer;
      &.active {
        color: #f85650;
      }
    }
  }
  .content {
    border-radius: 8px;
    transform: translateY(-80px);
    background: #fff;
    .details {
      .item {
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
  }
  .footer {
    padding: 40px 0 20px 0;
    background: linear-gradient(226deg, #c4b894 0%, #ede4d3 100%);
    .footerNav {
      margin-bottom: 20px;
      > span {
        font-weight: 500;
        color: #6f4d3a;
        font-size: 14px;
      }
    }
    p {
      margin-bottom: 6px;
      font-size: 12px;
      color: #6f4d3a;
    }
  }
}
</style>
