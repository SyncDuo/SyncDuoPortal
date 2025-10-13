<template>
  <a-modal
      v-model:open="isModalVisible"
      title="Update SyncFlow"
      @ok="handleOk"
      @cancel="handleCancel"
      @close="handleCancel"
      width="1000px"
      :destroyOnClose="true"
  >
    <a-tabs v-model:value="activeTab" type="card">
      <a-tab-pane key="basic" tab="Basic">
        <a-form class="input-group" layout="vertical">
          <a-form-item label="Source Folder" class="form-item">
            <a-input v-model:value="syncFlowInfo.sourceFolderPath" disabled/>
          </a-form-item>
        </a-form>
        <a-form class="input-group" layout="vertical">
          <a-form-item label="Dest Folder" class="form-item" >
            <a-input v-model:value="syncFlowInfo.destFolderPath" disabled/>
          </a-form-item>
        </a-form>
        <a-form class="input-group" layout="vertical">
          <a-form-item label="SyncFlow Name" class="form-item">
            <a-input v-model:value="syncFlowInfo.syncFlowName" disabled/>
          </a-form-item>
        </a-form>
      </a-tab-pane>

      <a-tab-pane key="advance" tab="Advance">
        <a-form class="input-group">
          <a-form-item label="filter Criteria" class="form-item">
            <a-input v-model:value="syncFlowInfo.filterCriteria"/>
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script setup lang="ts">
import {getSyncFlowInfo, updateFilterCriteria} from '../../api/Api'
import {ref, Ref} from 'vue';
import {
  createEmptySyncFlowInfo,
  SyncFlowInfo,
} from "../../api/SyncFlowDataType";
import {captureAndLog} from "../../util/ExceptionHandler";

// modal 是否打开的变量
const isModalVisible:Ref<boolean> = ref(false);
// 活动 tab 页的变量
const activeTab:Ref<string> = ref("basic");
// form ref
const syncFlowInfo: Ref<SyncFlowInfo> = ref(createEmptySyncFlowInfo());
// 获取 syncflow info 的函数
const getSyncFlowInfoFunc = async (syncFlowId:string) => {
  const syncFlowInfoTmp = await captureAndLog(() => getSyncFlowInfo(syncFlowId));
  if (syncFlowInfoTmp === null || syncFlowInfoTmp === undefined) {
    return;
  }
  syncFlowInfo.value = syncFlowInfoTmp;
}
// syncflow 创建完成后, 发送事件
const emit = defineEmits<{
  syncFlowUpdated: [];
}>();
// modal 正确关闭的事件逻辑
const handleOk = async () => {
  // 发起更新过滤条件的请求
  await captureAndLog(() => updateFilterCriteria({
    syncFlowId: syncFlowInfo.value.syncFlowId,
    filterCriteria: syncFlowInfo.value.filterCriteria
  }));
  isModalVisible.value = false;
  syncFlowInfo.value = createEmptySyncFlowInfo();
  emit('syncFlowUpdated');
};
// modal 取消/关闭事件的逻辑
const handleCancel = () => {
  isModalVisible.value = false;
  syncFlowInfo.value = createEmptySyncFlowInfo();
};
// 定义需要暴露的方法
defineExpose({
  // 控制 modal 显示隐藏的方法
  showUpdateSyncflowModal: async (syncFlowId: string) => {
    isModalVisible.value = true;
    await getSyncFlowInfoFunc(syncFlowId);
  },
});
</script>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
}

.form-item {
  margin-bottom: 16px;
}
</style>
