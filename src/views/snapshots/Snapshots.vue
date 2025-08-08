<template>
  <div class="snapshot_container">

    <div class="title_part">
      <span class="snapshot_title">Snapshots</span>
      <a-button class="refresh_button" type="link" @click="getTableData">
        <RetweetOutlined/>
      </a-button>
    </div>

    <a-table :columns="columns" :data-source="tableData" bordered >
      <!-- select syncflow  -->
      <template #title >
        <div class="select_syncflow_container">
          <a-select
              v-model:value="syncFlowId"
              show-search
              placeholder="Select a Path"
              style="width: 600px"
              allowClear
              :options="options"
              :filter-option="filterOption"
              @focus="getSelectOption"
              @change="getTableData"
          ></a-select>
        </div>
      </template>

      <!-- snapshots info -->
      <template #bodyCell="{ column, record }" style="padding-right: 5px">
        <template v-if="column.dataIndex === 'path'">
          <a>
            {{ record.path }}
          </a>
        </template>
        <template v-else-if="column.dataIndex === 'status'">
          <a-button class="backup_button"
                    @click="manualBackupSyncFlowFunc(record.syncFlowId)">
            <CopyOutlined />
            {{ record.status }}
          </a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, Ref} from "vue";
import {SnapshotsResponse, SnapshotsInfo} from "../../api/SnapshotsDataType";
import {getSnapshots, getSyncFlow, manualBackupSyncFlow} from "../../api/api";
import {CopyOutlined, RetweetOutlined} from "@ant-design/icons-vue";
import {formatTimestamp} from "../../util/DateUtil";
import type { SelectProps } from 'ant-design-vue';


// 下拉选择框的变量
const syncFlowId:Ref<string> = ref(null);
const options = ref<SelectProps['options']>([]);
const filterOption = (input: string, option: any) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
const getSelectOption = async () => {
  const syncFlowResponse = await getSyncFlow();
  if (!syncFlowResponse || syncFlowResponse.code !== 200) {
    console.error("getSelectOption failed. syncflowResponse is null or failed");
  } else {
    const syncFlowInfoList = syncFlowResponse.syncFlowInfoList;
    options.value.length = 0;
    syncFlowInfoList.forEach(item => {
      options.value.push({
        value: item.syncFlowId,
        label: item.destFolderPath,
      })
    })
  }
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
const tableData:Ref<Object[]> = ref([]);
const getTableData = async () => {
  tableData.value.length = 0;
  // 获取数据
  const snapshotsResponse:SnapshotsResponse = await getSnapshots(syncFlowId.value);
  if (snapshotsResponse === null || snapshotsResponse.code !== 200) {
    console.error("Error getting snapshots");
    return;
  }
  if (snapshotsResponse.snapshots === null) {
    return;
  }
  const snapshots:Map<string, SnapshotsInfo[]> = new Map(Object.entries(snapshotsResponse.snapshots));
  // 解析
  let key = 1;
  snapshots.forEach( (snapshotInfoList: SnapshotsInfo[], syncFlowId:string) => {
    if (snapshotInfoList === null || snapshotInfoList.length === 0) {
      return;
    }
    let firstItem = snapshotInfoList[0];
    tableData.value.push({
      syncFlowId: syncFlowId,
      key: key,
      path: firstItem.destFolderPath,
      lastBackupTime: formatTimestamp(firstItem.finishedAt),
      snapshotSize:  firstItem.snapshotSize === null ? "0 MB" : firstItem.snapshotSize + " MB",
      files: firstItem.backupFiles === null ? "0" : firstItem.backupFiles,
      status: firstItem.backupJobStatus,
      lastErrorMessage: firstItem.backupErrorMessage === null ? "/" : firstItem.backupErrorMessage,
    });
    key += 1;
  })
};
// 手动备份的函数
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
// 页面加载的时候获取全部 snapshotsInfo 和 全部 syncflow
onMounted(async () => {
  await getTableData();
})
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

.select_syncflow_container {
  display: flex;
  justify-content: flex-start;
}
</style>
