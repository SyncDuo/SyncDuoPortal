<template>
  <div class="snapshot_container">

    <div class="title_part">
      <span class="snapshot_title">Snapshots</span>
      <a-button class="refresh_button" type="link" @click="getSyncFlowSnapshotsInfoData">
        <RetweetOutlined/>
      </a-button>
    </div>

    <a-collapse v-model:activeKey="activeKey" accordion class="collapse">
      <template #expandIcon>
        <DeliveredProcedureOutlined />
      </template>
      <a-collapse-panel
          v-for="(syncFlowSnapshotsInfo, index) in syncFlowSnapshotsInfoList"
          :key="index"
          :name="index.toString()"
      >
        <!-- 每个折叠面板的标题 -->
        <template #header>
          <div class="custom-panel-text" style="font-size: 15px">
            <span>{{ syncFlowSnapshotsInfo.syncFlowName }}</span>
          </div>
        </template>
        <!-- 每个折叠面板的展开内容 -->
        <a-table :columns="columns" :data-source="tableData(syncFlowSnapshotsInfo)" bordered >
          <!-- 自定义表格标题 header -->
          <template #title >
            <!-- 手动备份的按钮 -->
            <div class="table_title" >
              <a-button class="backup_button"
                        @click="manualBackupSyncFlowFunc(syncFlowSnapshotsInfo.syncFlowId)">
                <CloudServerOutlined />
                BACKUP
              </a-button>
            </div>
          </template>

          <!-- snapshots info table-->
          <template #bodyCell="{ column, record }" style="padding-right: 5px">
            <template v-if="column.dataIndex === 'path'">
              <a-button
                  class="path_button"
                  type="link"
                  @click="handlePathButtonClick(record.backupJobId)" >
                {{ record.path }}
              </a-button>
            </template>
          </template>
        </a-table>
      </a-collapse-panel>
    </a-collapse>
  </div>
  <snapshots-history-modal ref="snapshotsModalRef" />
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref, Ref} from "vue";
import {SnapshotsResponse, SyncFlowWithSnapshots} from "../../api/SnapshotsDataType";
import {getSnapshots, manualBackupSyncFlow} from "../../api/api";
import {
  DeliveredProcedureOutlined,
  RetweetOutlined,
  CloudServerOutlined,
} from "@ant-design/icons-vue";
import {formatTimestamp} from "../../util/DateUtil";
import SnapshotsHistoryModal from "./SnapshotsHistoryModal.vue";
import {useGlobalTimerStore} from "../../store/timer";


// 全局定时器
const timer = useGlobalTimerStore();
// 定义 Snapshots History 的 ref, 用于访问其方法和变量
const snapshotsModalRef:Ref<InstanceType<typeof SnapshotsHistoryModal> | null> = ref(null);
// path button 点击事件, 展示 modal
const handlePathButtonClick = (backupJobId:string) => {
  if (snapshotsModalRef.value) {
    snapshotsModalRef.value.showModal(backupJobId);
  }
};
// 折叠面板需要的变量
const activeKey:Ref<string[]> = ref([]);
const syncFlowSnapshotsInfoList:Ref<SyncFlowWithSnapshots[]> = ref([]);
const getSyncFlowSnapshotsInfoData = async () => {
  const snapshotsResponse:SnapshotsResponse = await getSnapshots("");
  if (snapshotsResponse === null || snapshotsResponse.code !== 200) {
    console.error("Error getting snapshots");
    return;
  }
  if (snapshotsResponse.dataList === null) {
    return;
  }
  syncFlowSnapshotsInfoList.value = snapshotsResponse.dataList;
};
// 表格需要的变量
const columns = [
  {
    title: 'Path',
    dataIndex: 'path',
    width: 600,
  },
  {
    title: 'Backup Time',
    dataIndex: 'lastBackupTime',
    width: 150,
  },
  {
    title: 'Size',
    dataIndex: 'snapshotSize',
    width: 100,
  },
  {
    title: 'Files',
    dataIndex: 'files',
    width: 100,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 140,
  },
];
const tableData = (syncFlowSnapshotsInfo:SyncFlowWithSnapshots) => {
  const snapshotInfoList = syncFlowSnapshotsInfo.snapshotInfoList;
  if (snapshotInfoList == null || snapshotInfoList.length === 0) {
    return [];
  }
  let key = 0;
  return snapshotInfoList.map((snapshotInfo) => {
    key += 1;
    return {
      key: key,
      backupJobId: snapshotInfo.backupJobId,
      snapshotId: snapshotInfo.snapshotId,
      path: syncFlowSnapshotsInfo.destFolderPath,
      lastBackupTime: formatTimestamp(snapshotInfo.finishedAt),
      snapshotSize:  snapshotInfo.snapshotSize === null ? "0 MB" : snapshotInfo.snapshotSize + " MB",
      files: snapshotInfo.backupFiles === null ? "0" : snapshotInfo.backupFiles,
      status: snapshotInfo.backupJobStatus,
      lastErrorMessage: snapshotInfo.backupErrorMessage === null ? "/" : snapshotInfo.backupErrorMessage,
    }
  })
};
// 手动备份的函数
const manualBackupSyncFlowFunc = async (syncFlowId:string) => {
  if (syncFlowId === null) {
    console.error('syncFlowId is null!');
    return;
  }
  const snapshotsResponse = await manualBackupSyncFlow({syncFlowId:syncFlowId});
  console.log(snapshotsResponse);
  if (snapshotsResponse === null) {
    console.error('manual backup sync flow failed. snapshotsResponse is null!');
    return;
  }
  if (snapshotsResponse.code !== 200) {
    console.error("manual backup sync flow failed!" + snapshotsResponse.message);
    return;
  }
  await getSyncFlowSnapshotsInfoData();
};
// 页面加载的时候获取全部 syncFlowSnapshotsInfoData
onMounted(() => {
  timer.registerJob("getSyncFlowSnapshotsInfoData", getSyncFlowSnapshotsInfoData);
});
onUnmounted(() => {
  timer.unregisterJob("getSyncFlowSnapshotsInfoData");
});
</script>

<style scoped>
.snapshot_container {
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

.custom-panel-text {
  display: flex;
  align-items: center;
  width: 100%; /* Ensures the header spans the full width */
}

.table_title {
  display: flex; /* Use Flexbox to align buttons horizontally */
  justify-content: flex-start; /* Align items to the right */
}
</style>
