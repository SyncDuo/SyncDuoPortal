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
import { getHostName } from "../../api/api";
import {onMounted, Ref, ref} from "vue";
import SettingsModal from "../../components/SettingsModal.vue";


// 获取 hostName 并渲染
let hostName:Ref<string> = ref('');
onMounted(async () => {
      const fileSystemResponse = await getHostName();
      if (fileSystemResponse === null) {
        console.warn("getHostName() is null");
      } else if (fileSystemResponse.code !== 200) {
        console.warn("getHostName() failed. code is" + fileSystemResponse.code);
      } else {
        hostName.value = fileSystemResponse.hostName;
      }
    }
)
// 定义 SettingsModal 的 ref, 用于访问其方法和变量
const settingsModalRef = ref<InstanceType<typeof SettingsModal> | null>(null);
// 下拉菜单的 settings 按钮点击事件, 展示 modal
const handleSettingsButtonClick = e => {
  console.log('clickSettingsButton', e);
  if (settingsModalRef.value) {
    settingsModalRef.value?.showModal();
  }
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
