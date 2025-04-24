<template>
  <a-modal
      v-model:open="isModalVisible"
      title="Add SyncFlow"
      @ok="handleOk"
      @cancel="handleCancel"
      @close="handleCancel"
      width="1000px"
  >
    <a-tabs v-model:value="activeTab" type="card">
      <a-tab-pane key="basic" tab="Basic">
        <a-form class="input-group" layout="vertical">
          <a-form-item label="Source Folder" class="form-item">
            <search-bar v-model="form.sourceFolderFullPath" />
          </a-form-item>
          <a-form-item label="Dest Folder" class="form-item">
            <a-input-group compact>
              <search-bar v-model="form.destParentFolderFullPath" style="width: 80%"/>
              <a-input v-model:value="form.destFolderName" style="width: 20%" />
            </a-input-group>
          </a-form-item>
          <a-form-item label="SyncFlow Name" class="form-item">
            <a-input v-model:value="form.syncFlowName" />
          </a-form-item>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="advance" tab="Advance">
        <div class="input-group">
          <a-form-item label="Filter" class="form-item">
            <a-input v-model:value="form.filterCriteria"/>
          </a-form-item>
          <a-form-item label="Flatten" class="form-item">
            <a-radio-group v-model:value="form.flattenFolder">
              <a-radio :value="false">MIRROR</a-radio>
              <a-radio :value="true">FLATTEN</a-radio>
            </a-radio-group>
          </a-form-item>
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script setup lang="ts">
import {postSyncFlow} from '../../api/api'
import {ref, Ref} from 'vue';
import {CreateSyncFlowRequest, SyncFlowResponse} from "../../api/SyncFlowDataType";
import SearchBar from "../../components/SearchBar.vue";

// modal 是否打开的变量
const isModalVisible:Ref<boolean> = ref(false);
// 活动 tab 页的变量
const activeTab:Ref<string> = ref("basic");
// CreateSyncFlowRequest 初始化函数
const initCreateSyncFlowRequest = ():CreateSyncFlowRequest => {
  return {
    sourceFolderFullPath: "",
    destParentFolderFullPath: "",
    destFolderName: "",
    filterCriteria: "[]",
    flattenFolder: false,
    syncFlowName: "",
  }
}
// modal 填写的数据
const form:Ref<CreateSyncFlowRequest> = ref(initCreateSyncFlowRequest());
// syncflow 创建完成后, 发送事件
const emit = defineEmits<{
  syncFlowCreated: [];
}>();
// 提交数据的函数
const createSyncFlow = async (payload:CreateSyncFlowRequest) => {
  const syncFlowResponse:SyncFlowResponse = await postSyncFlow(payload);
  if (syncFlowResponse === null || form.value === null) {
    console.error('SyncFlow Create failed!');
  }
  if (syncFlowResponse.code === 500) {
    console.error('SyncFlow failed. ' + syncFlowResponse.message);
  }
  if (syncFlowResponse.code === 200) {
    emit('syncFlowCreated');
  }
}
// modal 正确关闭的事件逻辑
const handleOk = () => {
  console.log(form.value)
  createSyncFlow(form.value)
  isModalVisible.value = false;
  form.value = initCreateSyncFlowRequest();
  emit('syncFlowCreated');
};
// modal 取消/关闭事件的逻辑
const handleCancel = () => {
  isModalVisible.value = false;
  form.value = initCreateSyncFlowRequest();
};
// 定义需要暴露的方法
defineExpose({
  // 控制 modal 显示隐藏的方法
  showModal: () => {
    isModalVisible.value = true;
  }
})
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
