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
          <div class="custom-panel-text" style="font-size: 15px">
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
            <a-popover :content="syncFlowInfo.sourceFolderPath" placement="topRight">
            <span class="custom-card-text">{{ syncFlowInfo.sourceFolderPath }}</span>
            </a-popover>
          </template>
        </a-card>
        <a-card size="small" style="text-align: left;" title="DestPath">
          <template #extra>
            <a-popover :content="syncFlowInfo.destFolderPath" placement="topRight">
              <span class="custom-card-text">{{ syncFlowInfo.destFolderPath }}</span>
            </a-popover>
          </template>
        </a-card>
        <a-card size="small" style="text-align: left;" title="DestFolderStats">
          <template #extra>
            <FileOutlined /> {{ syncFlowInfo.destFolderStats.fileCount}}
            <FolderOutlined /> {{ syncFlowInfo.destFolderStats.folderCount }}
            <HddOutlined /> {{ syncFlowInfo.destFolderStats.space}} MB
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
          <a-button class="pause_button" @click="handlePauseSyncFlow(syncFlowInfo.syncFlowId)">
            <PauseOutlined/>
            Pause
          </a-button>
          <a-button class="resume_button" @click="handleResumeSyncFlow(syncFlowInfo.syncFlowId)">
            <PlayCircleOutlined/>
            Resume
          </a-button>
          <a-button class="rescan_button" @click="handleRescanSyncflow(syncFlowInfo.syncFlowId)">
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
      <a-button class="pause_button" @click="handlePauseAllSyncFlow">
        <PauseOutlined/>
        Pause
      </a-button>
      <a-button class="resume_button" @click="handleResumeAllSyncFlow">
        <PlayCircleOutlined/>
        Resume
      </a-button>
      <a-button class="rescan_button" @click="handleRescanAllSyncFlow">
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
import {getSyncFlow, changeSyncFlowStatus, changeAllSyncFlowStatus} from '../../api/api';
import {SyncFlowInfo, SyncFlowResponse, ChangeSyncFlowStatusRequest} from "../../api/SyncFlowDataType";
import SyncFlowModal from "./SyncFlowModal.vue";
import {EditOutlined, FolderOutlined, PauseOutlined, PlusOutlined, RetweetOutlined, FileOutlined,
HddOutlined, PlayCircleOutlined} from '@ant-design/icons-vue';
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
// sync flow 菜单添加按钮事件, 展示 modal
const handleSyncFlowAddButton = () => {
  if (childModalRef.value) {
    childModalRef.value.showModal();
  }
}
const handleSyncFlowAdd = () => {
  getSyncFlowInfoList();
}
const handleRescanAllSyncFlow = () => {
  changeAllSyncFlowStatus({
    syncFlowId: null,
    syncFlowStatus: "RESCAN"
  });
  handleSyncFlowRefresh();
}
const handlePauseAllSyncFlow = () => {
  changeAllSyncFlowStatus({
    syncFlowId: null,
    syncFlowStatus: "PAUSE"
  });
  handleSyncFlowRefresh();
}
const handleResumeAllSyncFlow = () => {
  changeAllSyncFlowStatus({
    syncFlowId: null,
    syncFlowStatus: "RESUME"
  });
  handleSyncFlowRefresh();
}
const handleRescanSyncflow = (syncFlowId:string) => {
  changeSyncFlowStatus({
    syncFlowId: syncFlowId,
    syncFlowStatus: "RESCAN"
  });
  handleSyncFlowRefresh();
}
const handlePauseSyncFlow = (syncFlowId:string) => {
  changeSyncFlowStatus({
    syncFlowId: syncFlowId,
    syncFlowStatus: "PAUSE"
  });
  handleSyncFlowRefresh();
}
const handleResumeSyncFlow = (syncFlowId:string) => {
  changeSyncFlowStatus({
    syncFlowId: syncFlowId,
    syncFlowStatus: "RESUME"
  });
  handleSyncFlowRefresh();
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
  width: 580px;
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

.custom-card-text {
  max-width: 300px; /* Adjust based on layout */
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
}
</style>
