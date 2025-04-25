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
          <a-form-item label="Sync Storage Path" class="form-item">
            <search-bar v-model="form.syncStoragePath" />
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script setup lang="ts">
import {getSystemConfig, postSystemConfig} from '../../api/api';
import {ref, Ref, watch} from 'vue';
import SearchBar from "../../components/SearchBar.vue";
import {SystemConfig, UpdateSystemConfigRequest} from "../../api/SystemConfigDataType";

// modal 是否打开的变量
const isModalVisible:Ref<boolean> = ref(false);
// 活动 tab 页的变量
const activeTab:Ref<string> = ref("general");
// 定义 systemConfig
const form:Ref<SystemConfig> = ref<SystemConfig>({
  systemConfigId: "",
  syncStoragePath: ""
});
// systemConfig 初始化函数
const initSystemConfig = async () => {
  const systemConfigResponse = await getSystemConfig();
  if (systemConfigResponse === null) {
    console.error("get systemConfig failed");
  }
  if (systemConfigResponse.code === 500) {
    console.error("get systemConfig failed. " + systemConfigResponse.message);
  }
  if (systemConfigResponse.code === 200) {
    // 第一次登录系统,没有设置参数,所以 form 需要设置为空对象, 而不是 null
    if (systemConfigResponse.systemConfigMap === null) {
      form.value = {
        systemConfigId: "",
        syncStoragePath: ""
      }
    } else {
      form.value = systemConfigResponse.systemConfigMap;
    }
  }
};
// systemConfig 更新完成后, 发送的事件
const emit = defineEmits<{
  systemConfigUpdated: [];
}>();
// 更新 systemConfig 函数
const updateSystemConfig = async (payload:UpdateSystemConfigRequest) => {
  const systemConfigResponse = await postSystemConfig(payload);
  if (systemConfigResponse === null) {
    console.error("update systemConfig failed");
  }
  if (systemConfigResponse.code === 500) {
    console.error("update systemConfig failed. " + systemConfigResponse.message);
  }
  if (systemConfigResponse.code === 200) {
    emit('systemConfigUpdated');
  }
};
// modal 正确关闭的事件逻辑
const handleOk = () => {
  console.log(form.value)
  updateSystemConfig({
    systemConfigMap: form.value
  })
  isModalVisible.value = false;
  initSystemConfig();
  emit('systemConfigUpdated');
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
