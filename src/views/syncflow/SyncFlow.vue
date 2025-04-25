<template>
  <div class="syncflow_container">
    <div class="title-part">
      <span class="title">SyncFlow</span>
      <a-button class="refresh_button" type="link" @click="handleSyncFlowRefresh">
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
        <a-card size="small" style="text-align: left;" title="SyncFlowType">
          <template #extra>
            {{ syncFlowInfo.syncFlowType }}
          </template>
        </a-card>
        <a-card size="small" style="text-align: left;" title="SyncSetting">
          <template #extra>
            {{ syncFlowInfo.syncMode }}
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
      <a-button class="add_button" @click="handleSyncFlowAddButton">
        <PlusOutlined/>
        Add
      </a-button>
      <!-- Use the ModalComponent -->
      <sync-flow-modal ref="childModalRef" @syncFlowCreated="handleSyncFlowAdd"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {getSyncFlow} from '../../api/api';
import {SyncFlowInfo, CreateSyncFlowRequest, SyncFlowResponse} from "../../api/SyncFlowDataType";
import SyncFlowModal from "./SyncFlowModal.vue";
import {EditOutlined, FolderOutlined, PauseOutlined, PlusOutlined, RetweetOutlined} from '@ant-design/icons-vue';
import {onMounted, Ref, ref} from 'vue';

// 折叠面板选中的 key
const activeKey:Ref<string[]> = ref([]);
// 定义 syncFlowInfoList
let syncFlowInfoList:Ref<SyncFlowInfo[]> = ref([]);
// 请求 syncflow 数据的函数
const getSyncFlowInfoList = async () => {
  const syncFlowResponse:SyncFlowResponse = await getSyncFlow();
  if (syncFlowResponse === null) {
    console.error('SyncFlow not found!');
    syncFlowInfoList.value = [];
    return;
  }
  if (syncFlowResponse.code === 500) {
    console.error('SyncFlow failed. ' + syncFlowResponse.message);
    syncFlowInfoList.value = [];
    return;
  }
  syncFlowInfoList.value = syncFlowResponse.syncFlowInfoList;
}
// 页面加载的时候获取 syncflow 数据渲染
onMounted(() => {
  getSyncFlowInfoList();
});
// sync flow 菜单刷新按钮事件, 触发 api 查询, 刷新页面数据
const handleSyncFlowRefresh = () => {
  getSyncFlowInfoList();
};
// 定义 syncFlowModal 的 ref, 用于访问其方法和变量
const childModalRef:Ref<InstanceType<typeof SyncFlowModal | null>> = ref(null);
// State to store form data
let formData:Ref<CreateSyncFlowRequest> = ref(null);
// sync flow 菜单添加按钮事件, 展示 modal
const handleSyncFlowAddButton = () => {
  if (childModalRef.value) {
    childModalRef.value.showModal();
  }
}
const handleSyncFlowAdd = () => {
  getSyncFlowInfoList();
}
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
