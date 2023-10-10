<template>
  <div class="wrapper bg-white">
      <div class="header h-220px">
          <div class="w-1140px ml-auto mr-auto">
              <Header :type="3"></Header>
          </div>
      </div>
      <div class="mian" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="加载中、请稍候..." element-loading-background="rgba(216, 207, 180, 0.4)">
        <div class="searchname">
          <el-input
            v-model="datas.searchAuthorName"
            placeholder="输入名字"
            style="width:260px"
            clearable
          >
            <template #append>
              <el-button color="#F85659" :icon="Search" @click="searchAuthor" class="searchBtn" type="primary"></el-button>
            </template>
          </el-input>
        </div>
        <div class="timeScroll">
          <div class="table" :style="{minHeight:!(tableList.length > 0) ? '380px' : 0}">
            <div id="header">
              <ul class="scale">
                <!-- <li v-for="item in scale" :key="item" :style="{width: initData.step * 7.12 + 'px'}">
                  <p>|</p>
                </li> -->
              </ul>
              <div>
                <p>{{tableStart}}</p>
              </div>
              <div>
                <p>{{tableStart + 25}}</p>
              </div>
              <div>
                <p>{{tableStart + 50}}</p>
              </div>
              <div>
                <p>{{tableStart + 75}}</p>
              </div>
              <div style="width: auto;">
                <p>{{tableStart + 100}}</p>
              </div>
            </div>
            <div id="border"></div>
            <ul  v-if="tableList.length > 0">
              <li v-for="(item, index) in tableList" :key="index">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div style="width: 116px;"></div>
                <p
                :style="{
                  marginLeft: ((item.birthYear - tableStart)/100) * 864 + 'px',
                  width: ((item.deathYear - item.birthYear)/100) * 864 + 'px'
                  }"
                  class="progressBox progress"
                >
                <span class="userName">{{ item.name }}({{ item.birthYear }}-{{ item.deathYear}})</span>
                </p>
              </li>
            </ul>
            <h1 class="noData" v-else v-text="noData"></h1>
          </div>
        </div>
      </div>
      <div :style="{marginTop:tableList.length > 0 ? '40px' : '0'}">
          <Footer></Footer>
      </div>
      <el-button color="#f4f1ea" type="info" :icon="ArrowLeftBold" class="left"  @click="switchYear(-150, 'left')" v-if="show" :disabled="defaultStartYear === initData.startYear"></el-button>
      <el-button color="#f4f1ea" type="info" :icon="ArrowRightBold" class="right" @click="switchYear(150, 'right')" v-if="show" :disabled="defaultStartYear === initData.endYear"></el-button>
  </div>
  <el-dialog v-model="datas.drawerShow" title="搜索结果" width="500" :close-on-click-modal="false">
    <div style="margin: 0 auto">
      <el-table :data="datas.searchAuthorList" @row-click="handleSelect">
        <el-table-column property="name" label="名字" minWidth="100" />
        <el-table-column property="birthYear" label="出生年" width="100" />
        <el-table-column property="deathYear" label="死亡年"  width="100"/>
        <el-table-column property="dynastyChn" label="朝代"  width="60"/>
        <el-table-column  label="操作"  width="80">
          <span class="btn">选择</span>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ArrowLeftBold,ArrowRightBold,Search } from '@element-plus/icons-vue';
import Header from '@/components/header.vue';
import Footer from '@/components/footer.vue';
import { ref,reactive } from 'vue';
import {getTimeList,getInitData,getTimeListRight,findPersonByPersonName} from '../../api/common'
import {useRouter} from 'vue-router';
import { ElMessage } from 'element-plus'
const show = ref(false) // 按钮显示隐藏
const noData = ref('') // 没有数据显示字样
const router = useRouter();
const fullscreenLoading = ref(true) // 加载中状态
const selectAuthorName = ref('') // 加载中状态

const datas = reactive({
    searchAuthorName: '',
    drawerShow: false,
    searchAuthorList: [] as any,

})
const handleSelect = (row: any) => {
    console.log('[ row ]=>-108', row.name)
    datas.drawerShow = false;
    let rowData:any;
    for (let i = 0; i < datas.searchAuthorList.length; i++) {
        if (datas.searchAuthorList[i].personId == row.personId) {
            rowData = datas.searchAuthorList[i];
            break;
        }
    }
    if (rowData.birthYear == null) {
        ElMessage({ message: '该人物的出生日期为空', type: 'warning' })
        return
    }
    if (rowData.deathYear == null) {
        ElMessage({ message: '该人物的死亡日期为空', type: 'warning' })
        return
    }
    selectAuthorName.value = row.name
    resetTime(rowData.birthYear)
}
const searchAuthor = () => {
    if (datas.searchAuthorName == '') {
        ElMessage({ message: '请输入名字', type: 'warning' })
        return
    }
    findPersonByPersonName({ name: datas.searchAuthorName }).then(res => {
        console.log(res)
        if (res.data == null) {
            ElMessage({ message: '没有找到此作者', type: 'error' })
            return
        }
        if (res.data.length >= 1) {
            datas.searchAuthorList = res.data;
            datas.drawerShow = true;
        }
    })
}
const tableList = ref<any>([])
const initData = ref<any>({}) // 初始数据
const tableStart = ref(0) // 表格开始位置
const defaultStartYear = ref(0) // 默认获取列表参数
const replaceLastTwoDigits = (num, newDigits) => {  // 将开始时间转化为整数
  let numStr = num.toString();
  if(num < 0) {
    let newNumStr = numStr.slice(0, numStr.length - 2) + '00';
    let newNum = parseInt(newNumStr);
    let oldNum = parseInt(newDigits)
    return newNum - oldNum
  } else {
    let newNumStr = numStr.slice(0, numStr.length - 2) + newDigits;
    let newNum = parseInt(newNumStr);
    return newNum;
  }
}
const switchYear = (year, code) => { //切换显示范围
  fullscreenLoading.value = true
  defaultStartYear.value += year
  if(defaultStartYear.value < initData.value.startYear) {
    defaultStartYear.value = initData.value.startYear
  }
  if(defaultStartYear.value + 150 > initData.value.endYear) {
    defaultStartYear.value = initData.value.endYear - 150
  }
  if(defaultStartYear.value + 150 !== initData.value.endYear || defaultStartYear.value !== initData.value.startYear) {
    tableList.value = []
  }
  if(code === 'left') {
    show.value = false
    getTimeListRight(defaultStartYear.value).then(res => {
      tableList.value = res.data
      fullscreenLoading.value = false
      noData.value =  res.data.length > 0 ? '' : '暂无数据'
      setTimeout(() => {
        if(defaultStartYear.value === initData.value.startYear) {
          ElMessage({
            message: '前面没有更多了',
            type: 'success',
          })
        }
      }, 2000);
        show.value = true
    })
    tableStart.value -= 150
  } else {
    show.value = false
    getTimeList(defaultStartYear.value).then(res => {
      tableList.value = res.data
      fullscreenLoading.value = false
      noData.value =  res.data.length > 0 ? '' : '暂无数据'
      console.log((defaultStartYear.value + 150) , );
      setTimeout(() => {
        if((defaultStartYear.value + 150) === initData.value.endYear) {
          ElMessage({
            message: '当前已是最后一页',
            type: 'success',
          })
        }
      }, 500);
        show.value = true
    })
    tableStart.value += 150
  }
}
const scale = ref(0) //刻度
getInitData().then(res => { // 初始化
  show.value = false
  initData.value = res.data
  scale.value = Math.floor(980 / (initData.value.step * 7.12))
  defaultStartYear.value = res.data.defaultStartYear
  tableStart.value = defaultStartYear.value % 100 > 50 ? replaceLastTwoDigits(defaultStartYear.value, '50') : replaceLastTwoDigits(defaultStartYear.value, '00')
  getTimeList(defaultStartYear.value - 25).then(res => {
  tableList.value = res.data
  noData.value =  res.data.length > 0 ? '' : '暂无数据'
  fullscreenLoading.value = false
  show.value = true
})
})
const resetTime = (startYear:any) => {
  show.value = false
  scale.value = Math.floor(980 / (initData.value.step * 7.12))
  defaultStartYear.value = startYear-25
  tableStart.value = Math.floor(defaultStartYear.value / 25) * 25;
  // tableStart.value = defaultStartYear.value % 100 > 50 ? replaceLastTwoDigits(defaultStartYear.value, '50') : replaceLastTwoDigits(defaultStartYear.value, '00')
  getTimeList(tableStart.value).then(res => {
    tableList.value = res.data
    console.log('[ tableList.value ]=>-229', tableList.value)
    const index = tableList.value.findIndex(item => item.name === selectAuthorName.value)
    if (index !== -1) {
      const item = tableList.value.splice(index, 1)[0]
      tableList.value.unshift(item)
    }
    noData.value =  res.data.length > 0 ? '' : '暂无数据'
    fullscreenLoading.value = false
    show.value = true
  })}
</script>
<style lang="less" scoped>
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
  background: #FAFBFC;
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
