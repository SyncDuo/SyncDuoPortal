<template>
  <div class="system_info_container">
    <div class="title-part">
      <span class="title">SystemInfo</span>
      <a-button class="refresh_button" type="link" @click="handleSystemInfoRefresh">
        <RetweetOutlined/>
      </a-button>
    </div>

    <div class="system_info">
      <a-card :title="systemInfoResponse?.hostName" style="text-align: left">
        <a-card size="small" style="text-align: left;" title="syncFlowNumber">
          <template #extra>
            {{ systemInfoResponse.syncFlowNumber }}
          </template>
        </a-card>
        <a-card size="small" style="text-align: left;" title="fileCopyRate">
          <template #extra>
            {{ systemInfoResponse.fileCopyRate }} MB/s
          </template>
        </a-card>
        <a-card size="small" style="text-align: left;" title="folderStats">
          <template #extra>
            <FileOutlined /> {{ systemInfoResponse.folderStats?.fileCount }}
            <FolderOutlined /> {{ systemInfoResponse.folderStats?.folderCount }}
            <HddOutlined /> {{ systemInfoResponse.folderStats?.space }} MB
          </template>
        </a-card>
        <a-card size="small" style="text-align: left;" title="watchers">
          <template #extra>
            {{ systemInfoResponse.watchers }}
          </template>
        </a-card>
        <a-card size="small" style="text-align: left;" title="uptime">
          <template #extra>
            {{ systemInfoResponse.uptime }}
          </template>
        </a-card>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {getSystemInfo} from '../../api/api';
import {SystemInfoResponse} from "../../api/SystemInfoDataType.js";
import {FolderOutlined, FileOutlined, HddOutlined, RetweetOutlined} from '@ant-design/icons-vue';
import {onMounted, Ref, ref} from 'vue';


// 定义 systemInfoResponse
let systemInfoResponse:Ref<SystemInfoResponse> = ref({
  code: null,
  message: '',
  hostName: 'not available',
  syncFlowNumber: null,
  fileCopyRate: '',
  folderStats: null,
  watchers: null,
  uptime: ''
});
// 请求 systemInfoResponse 数据的函数
const getSystemInfoFunc = async () => {
  systemInfoResponse.value = {
    code: null,
    message: '',
    hostName: 'not available',
    syncFlowNumber: null,
    fileCopyRate: '',
    folderStats: null,
    watchers: null,
    uptime: ''
  }
  const result:SystemInfoResponse = await getSystemInfo();
  if (result === null) {
    console.log("get systemInfo failed");
  } else if (result.code === 500) {
    console.log("get systemInfo failed. " + result.message);
  } else {
    systemInfoResponse.value = result;
  }
}
//
// 页面加载的时候获取 syncflow 数据渲染
onMounted(() => {
  getSystemInfoFunc();
});
// system 菜单刷新按钮事件, 触发 api 查询, 刷新页面数据
const handleSystemInfoRefresh = () => {
  getSystemInfoFunc();
};
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

.title {
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
</style>
