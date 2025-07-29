<template>
<!--  <div>-->
<!--    <a-alert-->
<!--        v-if="showAlert"-->
<!--        message="Success Text"-->
<!--        type="success"-->
<!--        show-icon >-->
<!--      <template #action>-->
<!--        <a-button-->
<!--            type="text"-->
<!--            size="small"-->
<!--            @click="handleClose"-->
<!--            style="margin-left: 8px"-->
<!--        >-->
<!--          Close-->
<!--        </a-button>-->
<!--      </template>-->
<!--    </a-alert>-->
<!--  </div>-->
  <!-- system config is null alert -->
  <div class="alert-container">
    <a-alert
        v-if="isShowingAlert"
        message="System config is null"
        description="Please navigate to Actions->Settings for filling up system config."
        type="error"
        banner >
      <template #action>
        <a-button
            type="text"
            size="small"
            @click="handleAlertClose"
            style="margin-left: 8px"
        >
          Close
        </a-button>
      </template>
    </a-alert>
  </div>

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
// 检查 system config 是否有值的函数
const checkSystemConfigValid = async () => {
  // 获取 system config
  const result = await getSystemConfig();
  console.log(result);
  isShowingAlert.value = result === null || result.systemConfigEntity === null;
  console.log(isShowingAlert.value);
}
onMounted(async () => {
  await checkSystemConfigValid();
})
const handleAlertClose = async () => {
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
