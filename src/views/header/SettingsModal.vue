<template>
  <a-modal
      v-model:open="isModalVisible"
      title="System Config"
      @ok="() => isModalVisible = false"
      @close="() => isModalVisible = false"
      width="1000px"
  >
    <a-tabs v-model:value="activeTab" type="card">
      <!-- system settings -->
      <a-tab-pane key="system" tab="System">
        <a-form class="input-group" layout="vertical">
          <a-form-item label="Folder Watcher Interval(Sec)" class="form-item">
            <a-input v-model:value="form.system.folderWatcherIntervalMillis" disabled />
          </a-form-item>
          <a-form-item label="Check Syncflow Status Interval(Sec)" class="form-item">
            <a-input v-model:value="form.system.checkSyncflowStatusIntervalMillis" disabled />
          </a-form-item>
        </a-form>
      </a-tab-pane>

      <!-- rclone settings -->
      <a-tab-pane key="rclone" tab="Rclone">
        <a-form class="input-group" layout="vertical">
          <a-form-item label="Http Base Url" class="form-item">
            <a-input v-model:value="form.rclone.httpBaseUrl" disabled />
          </a-form-item>
        </a-form>
      </a-tab-pane>

      <!-- restic settings -->
      <a-tab-pane key="restic" tab="Restic">
        <a-form class="input-group" layout="vertical">
          <a-form-item label="Backup Path" class="form-item">
            <a-input v-model:value="form.restic.backupPath" disabled />
          </a-form-item>
          <a-form-item label="Backup Interval(Sec)" class="form-item">
            <a-input v-model:value="form.restic.backupIntervalSec" disabled />
          </a-form-item>
          <a-form-item label="Restore Path" class="form-item">
            <a-input v-model:value="form.restic.restorePath" disabled />
          </a-form-item>
          <a-form-item label="Restore Age(Sec)" class="form-item">
            <a-input v-model:value="form.restic.restoreAgeSec" disabled />
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script setup lang="ts">
import { getSystemSettings } from '../../api/Api';
import {ref, Ref, watch} from 'vue';
import {createEmptySystemSettings, SystemSettings} from "../../api/SystemInfoDataType";
import {captureAndLog} from "../../util/ExceptionHandler";

// modal 是否打开的变量
const isModalVisible:Ref<boolean> = ref(false);
// 活动 tab 页的变量
const activeTab:Ref<string> = ref("system");
// 表单变量
const form:Ref<SystemSettings> = ref(createEmptySystemSettings());
// 获取 system settings 的函数
const getSystemSettingsAndConvert = async () => {
  const systemSettings = await captureAndLog(async () => {return await getSystemSettings()})();
  if (systemSettings === null || systemSettings === undefined) {
    form.value = createEmptySystemSettings();
    return;
  }
  form.value = systemSettings;
  // millis to second
  form.value.system.folderWatcherIntervalMillis =
      systemSettings.system.folderWatcherIntervalMillis.slice(0, -3);
  form.value.system.checkSyncflowStatusIntervalMillis =
      systemSettings.system.checkSyncflowStatusIntervalMillis.slice(0, -3);
}
// 页面加载的时候请求一次 systemConfig, 初始化数据
watch(isModalVisible, async (newVal) => {
  if (newVal === true) {
    await getSystemSettingsAndConvert();
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
