<template>
  <div class="syncflow_container">
    <div class="title-part">
      <span class="title">SyncFlow</span>
      <a-button class="refresh_button" type="link">
        <RetweetOutlined/>
      </a-button>
    </div>

    <a-collapse v-model:activeKey="activeKey" accordion class="collapse">
      <template #expandIcon>
        <FolderOutlined/>
      </template>
      <a-collapse-panel
          v-for="(syncFlowInfo, index) in syncFlowInfoList"
          :key="index"
          :name="index.toString()"
      >
        <template #header>
          <div class="custom-panel-text">
            <span>{{ syncFlowInfo.syncFlowName }}</span>
            <span class="status">{{ syncFlowInfo.syncStatus }}</span>
          </div>
        </template>
        <a-card size="small" style="text-align: left;" title="SyncFlowId">
          <template #extra>
            {{ syncFlowInfo.syncFlowId }}
          </template>
        </a-card>
        <a-card size="small" style="text-align: left;" title="SourcePath">
          <template #extra>
            {{ syncFlowInfo.sourceFolderPath }}
          </template>
        </a-card>
        <a-card size="small" style="text-align: left;" title="DestPath">
          <template #extra>
            {{ syncFlowInfo.destFolderPath }}
          </template>
        </a-card>
        <a-card size="small" style="text-align: left;" title="SyncSetting">
          <template #extra>
            {{ syncFlowInfo.syncSettings }}
          </template>
        </a-card>
        <a-card size="small" style="text-align: left;" title="Ignore">
          <template #extra>
            {{ syncFlowInfo.ignorePatten }}
          </template>
        </a-card>
        <a-card size="small" style="text-align: left;" title="LastSyncTime">
          <template #extra>
            {{ syncFlowInfo.lastSyncTimeStamp }}
          </template>
        </a-card>
        <div class="sync_flow_info_buttons">
          <a-button class="pause_button">
            <PauseOutlined/>
            Pause
          </a-button>
          <a-button class="rescan_button">
            <RetweetOutlined/>
            Rescan
          </a-button>
          <a-button class="edit_button">
            <EditOutlined/>
            Edit
          </a-button>
        </div>
      </a-collapse-panel>
    </a-collapse>

    <div class="sync_flow_buttons">
      <a-button class="pause_button">
        <PauseOutlined/>
        Pause
      </a-button>
      <a-button class="rescan_button">
        <RetweetOutlined/>
        Rescan
      </a-button>
      <a-button class="add_button">
        <PlusOutlined/>
        Add
      </a-button>
    </div>
  </div>
</template>

<script setup>
import {getSyncFlow} from '../api/api.js';
import {EditOutlined, FolderOutlined, PauseOutlined, PlusOutlined, RetweetOutlined} from '@ant-design/icons-vue';
import {onMounted, ref} from 'vue';


// 折叠面板选中的 key
const activeKey = ref([]);
// 获取 syncFlowInfoList 并渲染
let syncFlowInfoList = ref([]);
onMounted(async () => {
  await getSyncFlow()
      .then(res => {
        syncFlowInfoList.value = res.syncFlowInfoList;
      })
      .catch(err => console.error(err));
})
</script>

<style scoped>
.syncflow_container {
  display: flex;
  flex-direction: column; /* Stack elements vertically */
}

.title-part {
  display: flex;
  justify-content: flex-start;
}

.title {
  text-align: left;
  margin-bottom: 16px; /* Add some space below the title */
  font-size: 25px;
}

.refresh_button:hover, .refresh_button:focus {
  border: none;
  outline: none;
}

.collapse {
  width: 800px;
}

.custom-panel-text {
  display: flex;
  align-items: center;
  width: 100%; /* Ensures the header spans the full width */
}

.status {
  margin-left: auto;
  color: #4aa265;
}

.sync_flow_buttons, .sync_flow_info_buttons {
  display: flex; /* Use Flexbox to align buttons horizontally */
  justify-content: flex-end; /* Align items to the right */
  gap: 8px; /* Add space between buttons */
  margin-top: 16px; /* Add space above buttons */
}
</style>
