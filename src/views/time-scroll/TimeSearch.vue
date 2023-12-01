<template>
  <div class="time-search">
    <div class="time-search__item">
      <el-input
        v-model="params.author"
        placeholder="请输入人名"
        class="time-scroll__filter-input"
      >
        <template #prepend>
          <span>作者</span>
        </template>
      </el-input>
    </div>
    <div class="time-search__item">
      <el-input
        v-model="params.author"
        placeholder="Please input"
        :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
        :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
      />
    </div>
    <div class="time-search__item">
      <el-select
        v-model="params.historicalEvent"
        multiple
        collapse-tags
        :max-collapse-tags="2"
        :multiple-limit="4"
        placeholder="请选择"
        style="width: 100%;"
      >
        <el-option
          v-for="item in props.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="time-search__item">
      <el-input
        v-model="params.author"
        placeholder="Please input"
        :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
        :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
      />
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
  options: any
}

const props = withDefaults(defineProps<Props>(), {
  options: []
})

const params = reactive({
  author: '',
  works: '',
  historicalEvent: [],
  personalEvent: ''
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
    display: inline-block;
    width: 460px;
    margin-bottom: 30px;

    &:nth-child(even) {
      margin-left: 21px;
    }
  }

  &__button {
    width: 120px;
  }
}
</style>
<style lang="scss">
.time-search {
  .time-search__item .el-tag {
    margin-bottom: 0;
  }
}
</style>
