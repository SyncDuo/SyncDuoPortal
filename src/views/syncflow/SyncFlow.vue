<template>
  <div class="syncflow_container">

    <div class="title-part">
      <span class="title">Sync Flow</span>
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
          <a-button class="pause_button"
                    @click="changeSyncFlowStatusFunc(syncFlowInfo.syncFlowId, SyncFlowStatus.PAUSE)">
            <PauseOutlined/>
            {{ SyncFlowStatus.PAUSE }}
          </a-button>
          <a-button class="resume_button"
                    @click="changeSyncFlowStatusFunc(syncFlowInfo.syncFlowId, SyncFlowStatus.RESUME)">
            <PlayCircleOutlined/>
            {{ SyncFlowStatus.RESUME }}
          </a-button>
          <a-button class="rescan_button"
                    @click="changeSyncFlowStatusFunc(syncFlowInfo.syncFlowId, SyncFlowStatus.RESCAN)">
            <RetweetOutlined/>
            {{ SyncFlowStatus.RESCAN }}
          </a-button>
          <a-button class="backup_button"
                    @click="manualBackupSyncFlowFunc(syncFlowInfo.syncFlowId)">
            <CopyOutlined />
            BACKUP
          </a-button>
          <a-button class="edit_button" disabled>
            <EditOutlined/>
            EDIT
          </a-button>
        </div>
      </a-collapse-panel>
    </a-collapse>

    <div class="sync_flow_buttons">
      <a-button class="pause_button"
                @click="changeSyncFlowStatusFunc('0', SyncFlowStatus.PAUSE)">
        <PauseOutlined/>
        {{ SyncFlowStatus.PAUSE }}
      </a-button>
      <a-button class="resume_button"
                @click="changeSyncFlowStatusFunc('0', SyncFlowStatus.RESUME)">
        <PlayCircleOutlined/>
        {{ SyncFlowStatus.RESUME }}
      </a-button>
      <a-button class="rescan_button"
                @click="changeSyncFlowStatusFunc('0', SyncFlowStatus.RESCAN)">
        <RetweetOutlined/>
        {{ SyncFlowStatus.RESCAN }}
      </a-button>
      <a-button class="add_button" @click="handleSyncFlowAddButton">
        <PlusOutlined/>
        ADD
      </a-button>
      <!-- Use the ModalComponent -->
      <sync-flow-modal ref="childModalRef" @syncFlowCreated="getSyncFlowInfoList"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {changeAllSyncFlowStatus, changeSyncFlowStatus, getSyncFlow, manualBackupSyncFlow} from '../../api/api';
import {SyncFlowInfo, SyncFlowResponse, SyncFlowStatus} from "../../api/SyncFlowDataType";
import SyncFlowModal from "./SyncFlowModal.vue";
import {
  EditOutlined,
  FileOutlined,
  FolderOutlined,
  HddOutlined,
  PauseOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  RetweetOutlined,
  CopyOutlined,
} from '@ant-design/icons-vue';
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
const changeSyncFlowStatusFunc = (syncFlowId:string, syncFlowStatus:SyncFlowStatus) => {
  if (syncFlowId === null) {
    console.error('syncFlowId is null!');
    return;
  }
  if (syncFlowId === "0") {
    changeAllSyncFlowStatus({
      syncFlowId:syncFlowId,
      syncFlowStatus:syncFlowStatus
    }).finally(() => {getSyncFlowInfoList()});
  } else {
    changeSyncFlowStatus({
      syncFlowId:syncFlowId,
      syncFlowStatus:syncFlowStatus
    }).finally(() => {getSyncFlowInfoList()});
  }
}
const manualBackupSyncFlowFunc = async (syncFlowId:string) => {
  if (syncFlowId === null) {
    console.error('syncFlowId is null!');
    return;
  }
  const syncFlowResponse = await manualBackupSyncFlow({syncFlowId:syncFlowId});
  if (syncFlowResponse === null) {
    console.error('manual backup sync flow failed. syncFlowResponse is null!');
    return;
  }
  if (syncFlowResponse.code !== 200) {
    console.error("manual backup sync flow failed!" + syncFlowResponse.message);
    return;
  }
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
