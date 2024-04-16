<template>
  <div class="time-search">
    <div
      v-if="timeType === 'history'"
      class="time-search__item time-search__item-short"
    >
      <el-input
        v-model="params.startYear"
        placeholder="请输入起始年份"
        size="large"
        style="width: 220px;"
      ></el-input>
      <el-input
        v-model="params.endYear"
        placeholder="请输入结束年份"
        size="large"
        style="width: 220px;"
      ></el-input>
    </div>
    <div v-if="timeType === 'personal'" class="time-search__item">
      <span class="time-search__item-prefix">作者</span>
      <el-input
        v-model="params.personName"
        placeholder="请输入人名"
        class="time-search__item-input"
        size="large"
      ></el-input>
    </div>
    <div class="time-search__item">
      <span class="time-search__item-prefix">作品筛选</span>
      <el-select
        v-model="params.postTypeList"
        class="time-search__item-input"
        multiple
        collapse-tags
        :max-collapse-tags="2"
        :multiple-limit="5"
        placeholder="请选择"
        style="width: 100%;"
        size="large"
      >
        <el-option
          v-for="(item, index) in props.worksOptions"
          :key="index"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <div class="time-search__item">
      <span class="time-search__item-prefix">历史事件</span>
      <el-select
        v-model="params.historyEventTypeList"
        class="time-search__item-input"
        multiple
        collapse-tags
        :max-collapse-tags="2"
        :multiple-limit="4"
        placeholder="请选择"
        style="width: 100%;"
        size="large"
      >
        <el-option
          v-for="(item, index) in historicalEventOptions"
          :key="index"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <div class="time-search__item">
      <span class="time-search__item-prefix">个人事件</span>
      <el-select
        v-model="params.individualEventTypeList"
        class="time-search__item-input"
        multiple
        collapse-tags
        :max-collapse-tags="2"
        :multiple-limit="4"
        placeholder="请选择"
        style="width: 100%;"
        size="large"
      >
        <el-option
          v-for="(item, index) in personalEventOptions"
          :key="index"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <div>
      <el-button
        class="time-search__button"
        color="#6D6A63"
        size="large"
        @click="search"
      >搜索</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, toRaw } from 'vue'
import { ElMessage } from 'element-plus'

interface Props {
  timeType: string // 时间轴类型 history-历史时间轴 personal-个人时间轴
  historicalEventOptions: string[]
  personalEventOptions: string[]
  worksOptions: string[]
}

const props = withDefaults(defineProps<Props>(), {
  timeType: 'history',
  historicalEventOptions: () => [],
  personalEventOptions: () => [],
  worksOptions: () => []
})

const params = reactive({
  startYear: '',
  endYear: '',
  personName: '',
  postTypeList: [],
  historyEventTypeList: [],
  individualEventTypeList: []
})
const emits = defineEmits(['search'])

const isNumber = (input) => {
  // 使用正则表达式匹配数字
  var regex = /^\d+$/;
  return regex.test(input);
}
 

const validate = () => {
  // if (props.timeType === 'personal') return true
  if (props.timeType === 'history') {
    if (!isNumber(params.startYear) || !isNumber(params.endYear)) {
      ElMessage.error('起始年份和结束年份必须为数字')
      return false
    }
    
    if (
      (Number(params.startYear) < 618 || Number(params.startYear) > 1014) ||
      (Number(params.endYear) < 618 || Number(params.endYear) > 1014)
    ) {
      ElMessage.error('搜索范围为618-1014')
      return false
    }

    if (Number(params.startYear) > Number(params.endYear)) {
      ElMessage.error('开始年份应小于结束年份')
      return false
    }

    // const yearDiff = Number(params.endYear) - Number(params.startYear)
    // if (yearDiff < 50 || yearDiff > 500) {
    //   ElMessage.error('筛选年份范围应在50-500之间')
    //   return false
    // }
  }
  if (!params.postTypeList.length) {
    ElMessage.error('请选择作品筛选')
    return false
  }

  if (!params.historyEventTypeList.length) {
    ElMessage.error('请选择作历史事件')
    return false
  }

  if (!params.individualEventTypeList.length) {
    ElMessage.error('请选择个人事件')
    return false
  }
  return true
}

const search = () => {
  if (!validate()) return
  emits('search', toRaw(params))
}
</script>
<style lang="scss" scoped>
.time-search {
  position: relative;
  padding: 30px 26px 26px;
  margin-bottom: 68px;
  max-width: 1000px;
  background: #C2B594;
  border-radius: 4px;
  inset: 0;

  &::before {
    content: "";
    position: absolute;
    inset: 0;

    background:linear-gradient(rgba(255, 255, 255, 0),#F7EACB); 
    -webkit-mask-image: 
        linear-gradient(#fff 0 0), 
        linear-gradient(#fff 0 0);
    -webkit-mask-clip: 
      content-box,
      border-box;
    -webkit-mask-composite: xor;
            mask-composite: exclude; 
    padding: 1px; 
    border-radius: 4px;
  }

  &__item {
    position: relative;
    display: inline-block;
    width: 460px;
    margin-bottom: 30px;

    &:nth-child(even) {
      margin-left: 21px;
    }

    &-prefix {
      display: inline-flex;
      position: absolute;
      align-items: center;
      height: 100%;
      padding-left: 19px;
      font-size: 16px;
      color: #868070;
      z-index: 1;
    }

    &-short {
      display: inline-flex;
      justify-content: space-between;
      vertical-align: top;
    }
  }

  &__button {
    position: relative;
    width: 120px;
  }
}
</style>
<style lang="scss">
.time-search {
  .time-search__item .el-tag {
    margin-bottom: 0;
  }

  &__item {
    &-input {
      .el-input__wrapper {
        opacity: 0.8;
      }
  
      .el-input__wrapper,
      .el-select__tags {
        padding-left: 90px !important;
      }
  
      .el-select__tags .el-tag {
        padding: 0 11px;
        height: 30px;
        background: #fff;
        color: #868070;
      }

      input::placeholder {
        text-align: right;
      }
    }

    &-short {
      .el-input__wrapper {
        opacity: 0.8;
      }

      input::placeholder {
        text-align: center;
      }
    }
  }
}
</style>
