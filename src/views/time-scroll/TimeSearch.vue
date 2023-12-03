<template>
  <div class="time-search">
    <div
      v-if="timeType === 'personal'"
      class="time-search__item time-search__item-short"
    >
      <el-input
        v-model="params.author"
        placeholder="请输入起始年份"
        size="large"
        style="width: 220px;"
      ></el-input>
      <el-input
        v-model="params.author"
        placeholder="请输入结束年份"
        size="large"
        style="width: 220px;"
      ></el-input>
    </div>
    <div v-if="timeType === 'history'" class="time-search__item">
      <span class="time-search__item-prefix">作者</span>
      <el-input
        v-model="params.author"
        placeholder="请输入人名"
        class="time-search__item-input"
        size="large"
      ></el-input>
    </div>
    <div class="time-search__item">
      <span class="time-search__item-prefix">作品筛选</span>
      <el-select
        v-model="params.works"
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
          v-for="item in props.worksOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="time-search__item">
      <span class="time-search__item-prefix">历史事件</span>
      <el-select
        v-model="params.historicalEvent"
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
          v-for="item in props.historicalEventOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="time-search__item">
      <span class="time-search__item-prefix">个人事件</span>
      <el-select
        v-model="params.personalEvent"
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
          v-for="item in props.personalEventOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
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
import { reactive } from 'vue'

interface Props {
  timeType: string // 时间轴类型 history-历史时间轴 personal-个人时间轴
  historicalEventOptions: any
  personalEventOptions: any
  worksOptions: any
}

const props = withDefaults(defineProps<Props>(), {
  timeType: 'history',
  historicalEventOptions: [],
  personalEventOptions: [],
  worksOptions: []
})

const params = reactive({
  startYear: '',
  endYear: '',
  author: '',
  works: [],
  historicalEvent: [],
  personalEvent: []
})
const emits = defineEmits(['search'])

const search = () => {
  emits('search', params)
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
        padding-left: 90px;
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
