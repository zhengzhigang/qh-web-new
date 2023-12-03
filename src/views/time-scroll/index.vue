<template>
  <div class="time-scroll wrapper bg-white">
    <div class="header h-220px">
      <Header :type="3"></Header>
    </div>
    <div
      class="time-scroll__main" 
      id="eqweqw"
      v-loading.fullscreen.lock="state.loading"
      element-loading-text="加载中、请稍候..."
      element-loading-background="rgba(216, 207, 180, 0.4)"
    >
      <time-tabs
        :tabIndex="state.tabIndex"
        @switch="switchTab"></time-tabs>
      <time-search
        :historicalEventOptions="state.historicalEventOptions"
        :personalEventOptions="state.personalEventOptions"
        :worksOptions="state.worksOptions"
        :timeType="state.tabIndex === 0 ? 'history' : 'personal'"
        @search="search"
      ></time-search>
      <!-- 落地页 -->
      <div v-if="!state.timeData" style="margin-top: -40px;">
        <time-data-summary
          :eventNumber="state.summaryData.eventNumber"
          :workNumber="state.summaryData.workNumber"
          :relationNumber="state.summaryData.relationNumber"
        ></time-data-summary>
        <time-bar
          v-if="state.summaryData.list && state.summaryData.list.length"
          :title="state.summaryData.title"
          :data="state.summaryData.list"
          style="state.margin-bottom: 26px;"></time-bar>
        <time-line
          v-if="state.summaryData.list && state.summaryData.list.length"
          :isShowTab="false"
          :title="state.summaryData.title"
          :data="state.summaryData.list"></time-line>
      </div>
      <!-- 时间轴 -->
      <div v-if="state.timeData" class="time-scroll__content">
        <time-header></time-header>
        <div class="time-scroll__content-main" id="timeContnet">
          {{ state.lineX }}
          <time-dynasty></time-dynasty>
          <time-ruler></time-ruler>
          <time-expand></time-expand>
          <div class="time-scroll__content-line" :style="{ left: `${state.lineX}px` }"></div>
        </div>
        <time-line></time-line>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import Header from '@/components/headerNew.vue';
import Footer from '@/components/footer.vue';
import TimeTabs from './TimeTabs.vue'
import TimeSearch from './TimeSearch.vue'
import TimeHeader from './TimeHeader.vue'
import TimeLine from './TimeLine.vue'
import TimeBar from './TimeBar.vue'
import TimeDynasty from './TimeDynasty.vue'
import TimeExpand from './TimeExpand.vue'
import TimeRuler from './TimeRuler.vue'
import TimeDataSummary from './TimeDataSummary.vue'
import {
  historicalEventOptions,
  personalEventOptions,
  worksOptions,
  summaryData
} from './luodiye'

let timeContnet = null

const state = reactive({
  loading: false,
  tabIndex: 0, // 选中tab索引
  lineX: 0, // 时间线的x轴坐标
  offset: 0, // 时间轴区域元素的offsetLeft值的和
  historicalEventOptions: [], // 历史事件选项
  personalEventOptions: [], // 个人事件选项
  worksOptions: [], // 作品选项
  summaryData: {}, // 落地页数据
  timeData: {}
})

// 获取筛选项数据
const getFilterData = () => {
  setTimeout(() => {
    state.historicalEventOptions = historicalEventOptions
    state.personalEventOptions = personalEventOptions
    state.worksOptions = worksOptions
  }, 300)
}

// 获取落地页数据
const getLandingPageData = () => {
  state.loading = true
  setTimeout(() => {
    state.summaryData = summaryData
    state.loading = false
  }, 500)
}



const getAllParentElements = (element) => {
  var parentElements = []
 
  while (element.parentElement) {
    parentElements.push(element.parentElement)
    element = element.parentElement
  }
 
  return parentElements
}

// 切换tab
const switchTab = (index) => {
  state.tabIndex = index
}

// 搜索
const search = () => {
  setTimeout(() => {
    state.timeData = {}
  }, 300)
}

const moveTimeLine = (event) => {
  state.lineX = event.clientX - 172
}

onMounted(() => {
  getFilterData()
  getLandingPageData()

  timeContnet = document.getElementById('timeContnet')
  if (timeContnet) {
    const parents = getAllParentElements(timeContnet)
    console.log(timeContnet.offsetLeft)
  
    parents.forEach((el) => {
      console.log('^^^^', el.offsetLeft)
      state.offset = state.offset + el.offsetLeft
    })
    console.log(state.offset)
    timeContnet.addEventListener('mousemove', moveTimeLine)
  }
})
</script>
<style lang="less" scoped>
.time-scroll {
  background: #FCF9F1;

  &__main {
    position: relative;
    margin: -352px 0 0 50%;
    transform: translate(-50%);
    width: 1200px;
    background-repeat: repeat-y;
    background-position:center;
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
      top: 0;
      width: 1px;
      height: 100%;
      z-index: 1;
      background: #6D6A63;
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
.el-input-group__append, .el-input-group__prepend {
  padding: 0 !important;
}
.searchBtn {
  // background: #F85659 !important;
  .el-icon {
    // color: #ffffff !important;
  }
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
:deep(.el-tag.el-tag--info ) {
  --el-tag-bg-color: #f5f5f5;
  --el-tag-text-color:#2C3D50;
}
:deep(.el-tag){
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
  color: #2C3D50;
  line-height: 25px;
  border-left:none;
}
.progress  {
    position: absolute;
    margin-top: 55px;
    height: 8px;
    background: linear-gradient(302deg, #C867FF 0%, #A468E2 100%);
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
  .searchname{
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
    background-image: url('../../assets/timeBj.png');
    background-repeat: repeat-y;
    background-position:center;
    background-size: 1150px auto;
    border-radius: 5px;
    .timeScroll {
      margin: 0 40px;
      padding: 35px 40px 13px 40px;
      width: 1060px;
      background-color: #FEFEFD;
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
                color:#AEA68D;
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
              color: #AEA68D;
              line-height: 25px;
            }
          }
        }
        #border {
          width: 980px;
          height: 2px;
          background: linear-gradient(90deg, #EEE9DB 0%, #C7C1B0 100%);
        }
        ul {
          li {
            display: flex;
            height: 60px;
            width: 980px;
            border-top: 1px solid rgba(216, 207, 180, 0.4);
            div {
              position: relative;
              flex-shrink:0;
              height: 100%;
              width: 216px;
              border-left: 1px dashed #D8CFB4;
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
      transform: translate(-50%,-50%);
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
              color: #F85650;
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
              >p {
                  color: #2C3D50;
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
      background: linear-gradient(226deg, #C4B894 0%, #EDE4D3 100%);
      .footerNav {
          margin-bottom: 20px;
          >span {
              font-weight: 500;
              color: #6F4D3A;
              font-size: 14px;
          }
      }
      p {
          margin-bottom: 6px;
          font-size: 12px;
          color: #6F4D3A;
      }
  }
}
</style>
