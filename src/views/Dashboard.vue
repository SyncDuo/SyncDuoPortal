<template>
  <!-- system config is null alert -->
  <a-alert
      v-if="isShowingAlert"
      message="System config is null"
      description="Please navigate to Actions->Settings for filling up system config."
      type="error"
      banner
      closable
      @close="onClose"
  />

  <!-- LAYOUT -->
  <a-layout class="outer-layout">
    <!-- Header -->
    <a-layout-header class="header">
      <Header />
    </a-layout-header>

    <!-- Main Content Area -->
    <a-layout>
      <a-layout-content class="content">
        <!-- First Content Section -->
        <div class="content-section">
          <Syncflow />
        </div>

        <!-- Divider -->
        <a-divider class="divider" type="vertical" />

        <!-- Second Content Section -->
        <div class="content-section">
          <System />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import Header from './header/Header.vue';
import Syncflow from './syncflow/SyncFlow.vue';
import System from './system/System.vue';
import {getSystemConfig} from "../api/api";
import {onMounted, ref, Ref} from 'vue';

// tab 页标题
document.title = "Portal"
// 控制 Alert 显示的状态
const isShowingAlert:Ref<boolean> = ref(true);
// 防止重复提交的锁
const isClosing = ref(false);
// 检查 system config 是否有值的函数
const checkSystemConfigValid = async () => {
  // 获取 system config
  const result = await getSystemConfig();
  console.log(result);
  if (result === null || result.systemConfigEntity === null) {
    // API 条件不满足，重新显示 Alert
    showAlert.value = true;
    console.warn('操作未完成，请重试');
  } else {
    // 条件满足，保持关闭状态
    isShowingAlert.value = false;
    console.log('操作成功');
  }
}
onMounted(async () => {
  await checkSystemConfigValid();
})
const onClose = async () => {
  // 如果正在处理中，直接返回
  if (isClosing.value) return;
  // 设置防抖状态
  isClosing.value = true;
  await checkSystemConfigValid();
}
</script>

<style scoped>

.header {
  background-color: #f6f6f6;
  padding: 0 20px; /* Adjust the padding for proper spacing */
  display: flex;   /* Ensure the header uses flexbox */
  justify-content: space-between; /* Space out items in the header */
  align-items: center; /* Vertically center content */
  height: auto; /* Allow the height to adjust based on content */
  flex-wrap: wrap; /* Allow wrapping for smaller screens */
}

.content {
  display: flex;
  padding: 16px;
  background: white;
}

.content-section {
  flex: 1;
  padding: 16px;
  background: #fefefe;
  border-radius: 4px;
}

.divider {
  width: 0;
  height: auto !important;
  margin: 0 16px;
  color: white;
}
</style>
