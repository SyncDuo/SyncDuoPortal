<template>
  <a-modal
      v-model:open="isModalVisible"
      title="System Config"
      @ok="handleOk"
      @cancel="handleCancel"
      @close="handleCancel"
      width="1000px"
  >
    <a-tabs v-model:value="activeTab" type="card">
      <a-tab-pane key="general" tab="General">
        <a-form class="input-group" layout="vertical">
          <a-form-item label="Backup Storage Path" class="form-item">
            <search-bar v-model:value="form.backupStoragePath" />
          </a-form-item>
          <a-form-item label="Backup Interval Millis" class="form-item">
            <a-input v-model:value="form.backupIntervalMillis" />
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script setup lang="ts">
import {getSystemConfig, updateSystemConfig, createSystemConfig} from '../api/api';
import {ref, Ref, watch} from 'vue';
import SearchBar from "./SearchBar.vue";
import {SystemConfigEntity} from "../api/SystemConfigDataType";

// modal 是否打开的变量
const isModalVisible:Ref<boolean> = ref(false);
// 活动 tab 页的变量
const activeTab:Ref<string> = ref("general");
// 定义 systemConfig 初始化函数
const getEmptySystemConfig = ():SystemConfigEntity => {
  return {
    systemConfigId: null,
    backupStoragePath: "",
    backupIntervalMillis: 4 * 3600000 // default 4 hours
  }
};
// 定义 systemConfig
const form:Ref<SystemConfigEntity> = ref<SystemConfigEntity>(getEmptySystemConfig());
// systemConfig 初始化函数
const initSystemConfig = async () => {
  const systemConfigResponse = await getSystemConfig();
  if (systemConfigResponse === null) {
    console.error("get systemConfig failed");
  }
  if (systemConfigResponse.code === 500) {
    console.error("get systemConfig failed. " + systemConfigResponse.message);
  }
  if (systemConfigResponse.code === 200 && systemConfigResponse.systemConfigEntity !== null) {
    // 第一次登录系统,没有设置参数,所以 form 需要设置为空对象, 而不是 null
    form.value = systemConfigResponse.systemConfigEntity;
  }
};
// 更新 systemConfig 函数
const createOrUpdateSystemConfig = async (payload:SystemConfigEntity) => {
  let systemConfigResponse: null;
  if (payload.systemConfigId === null) {
    systemConfigResponse = await createSystemConfig(payload);
  } else {
    systemConfigResponse = await updateSystemConfig(payload);
  }
  if (systemConfigResponse === null) {
    console.error("update systemConfig failed");
  }
  if (systemConfigResponse.code === 500) {
    console.error("update systemConfig failed. " + systemConfigResponse.message);
  }
};
// modal 正确关闭的事件逻辑
const handleOk = () => {
  console.log(form.value);
  createOrUpdateSystemConfig(form.value);
  isModalVisible.value = false;
  initSystemConfig();
};
// modal 取消/关闭事件的逻辑
const handleCancel = () => {
  isModalVisible.value = false;
  initSystemConfig();
};
// 页面加载的时候请求一次 systemConfig, 初始化数据
watch(isModalVisible, (newVal) => {
  if (newVal === true) {
    initSystemConfig();
  }
});
// 定义需要暴露的方法
defineExpose({
  // 控制 modal 显示隐藏的方法
  showModal: () => {
    isModalVisible.value = true;
  }
});
</script>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
}

.form-item {
  margin-bottom: 16px;
}
</style>
