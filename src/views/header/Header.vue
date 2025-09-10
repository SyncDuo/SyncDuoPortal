<template>
  <div class="header-content">

    <div class="snapshot_title">
      <FileSyncOutlined class="title_logo" />
      <span class="syncduo">SyncDuo</span>
    </div>

    <span class="computer_name">{{ hostName }}</span>

    <a-dropdown class="dropdown_section">
      <template #overlay>
        <a-menu >
          <a-menu-item key="1" @click="handleSettingsButtonClick">
            <SettingOutlined />
            Settings
          </a-menu-item>
          <a-menu-item key="2">
            <FileTextFilled />
            Log
          </a-menu-item>
        </a-menu>
      </template>

      <a-button type="text">
        <SettingOutlined />
        <span class="actions">Actions</span>
        <DownOutlined />
      </a-button>
    </a-dropdown>

    <!-- Use the ModalComponent -->
    <settings-modal ref="settingsModalRef"/>
  </div>
</template>

<script setup lang="ts">
import {FileSyncOutlined, SettingOutlined, DownOutlined, FileTextFilled} from '@ant-design/icons-vue';
import { getHostName } from "../../api/Api";
import {onMounted, onUnmounted, Ref, ref} from "vue";
import SettingsModal from "./SettingsModal.vue";
import {useGlobalTimerStore} from "../../store/timer";
import {captureAndLog} from "../../util/ExceptionHandler";


// 获取全局定时器
const timer = useGlobalTimerStore();
// 获取 hostName 并渲染
let hostName:Ref<string> = ref('');
const getHostNameFunc = async () => {
  const hostNameString = await captureAndLog(async () => {return await getHostName()})();
  if (hostNameString === null || hostNameString === undefined) {
    hostName.value = "";
    return;
  }
  hostName.value = hostNameString;
};
onMounted(() => {
  timer.registerJob("getHostNameFunc", getHostNameFunc);
});
onUnmounted(() => {
  timer.unregisterJob("getHostNameFunc");
});
// 定义 SettingsModal 的 ref, 用于访问其方法和变量
const settingsModalRef = ref<InstanceType<typeof SettingsModal> | null>(null);
// 下拉菜单的 settings 按钮点击事件, 展示 modal
const handleSettingsButtonClick = () => {
  if (settingsModalRef === null || settingsModalRef === undefined) {
    console.error('setting modal is not init');
    return;
  }
  settingsModalRef.value.showModal();
}
</script>

<style scoped>
.header-content {
  display: flex;
  align-items: center;  /* Vertically center the icon and text */
}

.title_logo {
  font-size: 32px;
  margin-left: 8px;
  color: #1e87b1; /* Optional: Set icon color */
}

.syncduo {
  font-size: 18px;
  font-weight: bold;
  color: #1e87b1; /* Optional: Set text color */
}

.computer_name {
  font-size: 18px;
  margin-left: 16px;
  margin-right: 100px;
  color: #696969; /* Optional: Set text color */
}

.dropdown_section {
  margin-left: 750px;
}
</style>
