<template>
  <div class="time-header">
    <span>时间标尺</span>
    <div class="time-header__tab">
      <div>
        <span class="time-header__tab-text">视角选择</span>
        <span
          v-for="(item, index) in options"
          :key="index"
          class="time-header__tab-item"
          :class="{ active: item.value === active }"
          @click="switchTab(item.value)"
        >
          {{ item.label }}
        </span>
      </div>
      <el-button
        class="time-header__export"
        color="#6D6A63"
        @click="showExport"
      >
        <img class="time-header__export-img" src="../../assets/time-export.png" />
        数据导出
      </el-button>
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
  >
    <div>

    </div>
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
import { ref } from 'vue'

const emits = defineEmits(['switch'])

const options = ref([
  { label: '朝代', value: 0 },
  { label: '皇帝', value: 1 },
  { label: '年号', value: 2 }
])

const active = ref(0)
const isShowExportDialog = ref(false)

const switchTab = (value) => {
  active.value = value
  emits('switch', value)
}

const closeExport = () => {
  isShowExportDialog.value = false
}

const showExport = () => {
  isShowExportDialog.value = true
}

const confirmExport = () => {
  
}
</script>
<style lang="scss" scoped>
.time-header {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  color: #6D6A63;

  &__tab {
    display: inline-flex;

    &-text {
      margin-right: 13px;
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

      &.active {
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
