<template>
  <div class="system_info_container">
    <div class="title-part">
      <span class="snapshot_title">System Info</span>
      <a-button class="refresh_button" type="link" @click="getSystemInfoFunc">
        <RetweetOutlined/>
      </a-button>
    </div>

    <div class="system_info">
      <a-card size="small" class="system_info_card" title="SyncFlowNumber">
        <template #extra>
          {{ systemInfo.syncFlowNumber }}
        </template>
      </a-card>
      <a-card size="small" class="system_info_card" title="FileCopyRate">
        <template #extra>
          {{ systemInfo.fileCopyRate }} MB/s
        </template>
      </a-card>
      <a-card size="small" class="system_info_card" title="FolderStats">
        <template #extra>
          <FileOutlined />
          {{ systemInfo.folderStats.fileCount }}
          <FolderOutlined />
          {{ systemInfo.folderStats.folderCount }}
          <HddOutlined />
          {{ systemInfo.folderStats.space }} MB
        </template>
      </a-card>
      <a-card size="small" class="system_info_card" title="Watchers">
        <template #extra>
          {{ systemInfo.watchers }}
        </template>
      </a-card>
      <a-card size="small" class="system_info_card" title="Uptime">
        <template #extra>
          {{ systemInfo.uptime }}
        </template>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {getSystemInfo} from '../../api/Api';
import {createEmptySystemInfo, SystemInfo} from "../../api/SystemInfoDataType.js";
import {FileOutlined, FolderOutlined, HddOutlined, RetweetOutlined} from '@ant-design/icons-vue';
import {onMounted, onUnmounted, Ref, ref} from 'vue';
import {useGlobalTimerStore} from "../../store/timer";
import {captureAndLog} from "../../util/ExceptionHandler";

// 使用全局定时器
const timer = useGlobalTimerStore();
// 定义 systemInfoResponse
const systemInfo:Ref<SystemInfo> = ref(createEmptySystemInfo());
// 请求 systemInfoResponse 数据的函数
const getSystemInfoFunc = async () => {
  const systemInfoTmp = await captureAndLog(() => getSystemInfo());
  if (systemInfoTmp === null || systemInfoTmp === undefined) {
    systemInfo.value = createEmptySystemInfo();
    return;
  }
  // 直接赋值，因为结构完全一致
  systemInfo.value = {
    ...systemInfo.value,
    ...systemInfoTmp,
    folderStats: {
      ...systemInfo.value.folderStats,
      ...systemInfoTmp.folderStats
    }
  };
};
// 页面加载的时候获取 system 数据渲染
onMounted(() => {
  timer.registerJob("getSystemInfoFunc", getSystemInfoFunc);
});
onUnmounted(() => {
  timer.unregisterJob("getSystemInfoFunc");
})
</script>

<style scoped>
.system_info_container {
  display: flex;
  flex-direction: column; /* Stack elements vertically */
}

.title-part {
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

.system_info {
  width: 580px;
}

.system_info_card {
  text-align: left;
  font-size: 20px;
}
</style>
