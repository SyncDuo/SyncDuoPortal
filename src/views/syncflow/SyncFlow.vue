<template>
  <div class="syncflow_container">

    <div class="title_part">
      <span class="snapshot_title">Sync Flow</span>
      <a-button class="refresh_button" type="link" @click="getSyncFlowInfoListFunc">
        <RetweetOutlined/>
      </a-button>
    </div>

    <a-collapse v-model:activeKey="activeKey" accordion class="collapse">
      <template #expandIcon>
        <DeliveredProcedureOutlined />
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
        <a-card size="small" style="text-align: left;" title="SyncFlowType">
          <template #extra>
            {{ syncFlowInfo.syncFlowType }}
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
        <a-card size="small" style="text-align: left;" title="FilterCriteria">
          <template #extra>
            {{ syncFlowInfo.filterCriteria }}
          </template>
        </a-card>
        <a-card size="small" style="text-align: left;" title="LastSyncTime">
          <template #extra>
            {{ syncFlowInfo.lastSyncTimeStamp }}
          </template>
        </a-card>

        <div v-if="syncFlowInfo.syncFlowType == SyncFlowType.REACTIVE_SYNC" class="sync_flow_info_buttons">
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
          <a-button class="delete_button"
                    @click="deleteSyncFlowFunc(syncFlowInfo.syncFlowId)">
            <DeleteOutlined />
            DELETE
          </a-button>
          <a-button class="edit_button"
                    @click="handleSyncFlowEditButton(syncFlowInfo.syncFlowId)"
                    :disabled="editButtonDisable(syncFlowInfo)">
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
    </div>
  </div>

  <!-- Use the ModalComponent -->
  <sync-flow-create-modal ref="syncFlowCreateModal" @syncFlowCreated="getSyncFlowInfoListFunc"/>
  <sync-flow-update-modal ref="syncFlowUpdateModal" @syncFlowUpdated="getSyncFlowInfoListFunc"/>
</template>

<script setup lang="ts">
import {changeAllSyncFlowStatus, changeSyncFlowStatus, getAllSyncFlowInfo, deleteSyncFlow} from '../../api/Api';
import {SyncFlowInfo, SyncFlowStatus, SyncFlowType} from "../../api/SyncFlowDataType";
import SyncFlowCreateModal from "./SyncFlowCreateModal.vue";
import SyncFlowUpdateModal from "./SyncFlowUpdateModal.vue";
import {
    DeliveredProcedureOutlined,
    EditOutlined,
    FileOutlined,
    FolderOutlined,
    HddOutlined,
    PauseOutlined,
    PlayCircleOutlined,
    PlusOutlined,
    RetweetOutlined,
    DeleteOutlined,
} from '@ant-design/icons-vue';
import {onMounted, onUnmounted, Ref, ref} from 'vue';
import {useGlobalTimerStore} from "../../store/timer";
import {captureAndLog} from "../../util/ExceptionHandler";
import {message} from "ant-design-vue";


// 定时器
const timer = useGlobalTimerStore();
// 折叠面板选中的 key
const activeKey:Ref<string[]> = ref([]);
// edit 按钮是否可用的函数
const editButtonDisable = (syncFlowInfo: SyncFlowInfo): boolean => {
  if (syncFlowInfo === null || syncFlowInfo === undefined) {
    return true;
  }
  return syncFlowInfo.syncStatus !== SyncFlowStatus.PAUSE;
}
// 定义 syncFlowInfoList
let syncFlowInfoList:Ref<SyncFlowInfo[]> = ref([]);
// 请求 syncflow 数据的函数
const getSyncFlowInfoListFunc = async () => {
  const syncFlowInfoTmp = await captureAndLog(() => getAllSyncFlowInfo());
  if (syncFlowInfoTmp === null || syncFlowInfoTmp === undefined) {
    return;
  }
  syncFlowInfoList.value = syncFlowInfoTmp;
}
// 定义 syncFlowModal 的 ref, 用于访问其方法和变量
const syncFlowCreateModal:Ref<InstanceType<typeof SyncFlowCreateModal | null>> = ref(null);
const syncFlowUpdateModal:Ref<InstanceType<typeof SyncFlowUpdateModal | null>> = ref(null);
// sync flow 菜单添加按钮事件, 展示 modal
const handleSyncFlowAddButton = () => {
  if (syncFlowCreateModal === null || syncFlowCreateModal === undefined) {
    console.error("syncFlowCreateModal not initialized");
    return;
  }
  syncFlowCreateModal.value.showCreateSyncflowModal();
};
// sync flow 编辑按钮事件, 展示 modal
const handleSyncFlowEditButton = (syncFlowId: string) => {
  if (syncFlowUpdateModal === null || syncFlowUpdateModal === undefined) {
    console.error("syncFlowUpdateModal not initialized");
  }
  syncFlowUpdateModal.value.showUpdateSyncflowModal(syncFlowId);
};
// 改变syncflow状态的函数
const changeSyncFlowStatusFunc = async (syncFlowId:string, syncFlowStatus:SyncFlowStatus) => {
  if (syncFlowId === null) {
    console.error('syncFlowId is null!');
    return;
  }
  if (syncFlowId === "0") {
    await captureAndLog(() =>
        changeAllSyncFlowStatus({syncFlowId:syncFlowId, syncFlowStatus:syncFlowStatus}));
  } else {
    await captureAndLog(() =>
        changeSyncFlowStatus({syncFlowId: syncFlowId, syncFlowStatus: syncFlowStatus}));
  }
  await getSyncFlowInfoListFunc();
};
// 删除syncflow的函数
const deleteSyncFlowFunc = async (syncFlowId:string) => {
  if (syncFlowId === null || syncFlowId === undefined || syncFlowId === "0") {
    console.error("syncFlowId is null!");
    return;
  }
  await captureAndLog(() => deleteSyncFlow({syncFlowId:syncFlowId}));
  message.info("删除请求已提交, 最长15分钟后删除");
}
// 页面加载的时候获取 syncflow 数据渲染
onMounted(() => {
  timer.registerJob("getSyncFlowInfoList", getSyncFlowInfoListFunc);
});
onUnmounted(() => {
  timer.unregisterJob("getSyncFlowInfoList");
})
</script>

<style scoped>
.syncflow_container {
  display: flex;
  flex-direction: column; /* Stack elements vertically */
}

.title_part {
  display: flex;
  justify-content: flex-start;
}

.snapshot_title {
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
