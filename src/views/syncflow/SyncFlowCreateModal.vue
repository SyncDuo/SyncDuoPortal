<template>
  <a-modal
      v-model:open="isModalVisible"
      title="Add SyncFlow"
      @ok="handleOk"
      @cancel="handleCancel"
      @close="handleCancel"
      width="1000px"
      :destroyOnClose="true"
  >
    <a-tabs v-model:value="activeTab" type="card">
      <a-tab-pane key="basic" tab="Basic">
        <a-form class="input-group" layout="vertical" v-if="pendingSourceFolderOptions.length > 0">
          <a-form-item label="Pending Source Folder" class="form-item">
            <a-select
                v-model:value="form.sourceFolderFullPath"
                :allowClear="true"
                :options="pendingSourceFolderOptions"
                @select="() => sourceFolderInputDisabled=true"
                @deselect="() => sourceFolderInputDisabled=false"
            />
          </a-form-item>
        </a-form>
        <a-form class="input-group" layout="vertical">
          <a-form-item label="Source Folder" class="form-item">
            <search-bar v-model:value="form.sourceFolderFullPath" v-model:disabled="sourceFolderInputDisabled"/>
          </a-form-item>
        </a-form>
        <a-form class="input-group" layout="vertical">
          <a-form-item label="Dest Folder" class="form-item" >
            <a-input-group compact>
              <search-bar v-model:value="destParentFolderFullPath" style="width: 80%"/>
              <a-input v-model:value="destFolderName" style="width: 20%" />
            </a-input-group>
          </a-form-item>
        </a-form>
        <a-form class="input-group" layout="vertical">
          <a-form-item label="SyncFlow Name" class="form-item">
            <a-input v-model:value="form.syncFlowName" />
          </a-form-item>
        </a-form>
      </a-tab-pane>

      <a-tab-pane key="advance" tab="Advance">
        <a-form class="input-group">
          <a-form-item label="Filter Criteria" class="form-item">
            <a-input v-model:value="form.filterCriteria"/>
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script setup lang="ts">
import {addSyncFlow, getPendingSourceFolder} from '../../api/Api'
import {ref, Ref} from 'vue';
import {CreateSyncFlowRequest} from "../../api/SyncFlowDataType";
import SearchBar from "../../components/SearchPathInput.vue";
import {captureAndLog} from "../../util/ExceptionHandler";
import {SelectProps} from "ant-design-vue";

// modal 是否打开的变量
const isModalVisible:Ref<boolean> = ref(false);
// 活动 tab 页的变量
const activeTab:Ref<string> = ref("basic");
// source folder 输入框是否禁止的变量
const sourceFolderInputDisabled:Ref<boolean> = ref(false);
// 创建 destParentFolderFullPath 和 destFolderName, 用于最后拼接为 destFolderName
const destParentFolderFullPath:Ref<string> = ref("");
const destFolderName:Ref<string> = ref("");
// pending source folder
const pendingSourceFolderOptions:Ref<SelectProps['options']> = ref([]);
// CreateSyncFlowRequest 初始化函数
const initCreateSyncFlowRequest = ():CreateSyncFlowRequest => {
  // destParentFolderFullPath 和 destFolderName 也需要清空
  destParentFolderFullPath.value = "";
  destFolderName.value = "";
  return {
    sourceFolderFullPath: "",
    destFolderFullPath: "",
    filterCriteria: "[]",
    syncFlowName: ""
  }
};
// modal 填写的数据
const form:Ref<CreateSyncFlowRequest> = ref(initCreateSyncFlowRequest());
// syncflow 创建完成后, 发送事件
const emit = defineEmits<{
  syncFlowCreated: [];
}>();
// 提交数据的函数
const createSyncFlow = async (payload:CreateSyncFlowRequest) => {
  await captureAndLog(() => addSyncFlow(payload));
  emit('syncFlowCreated');
};
// 获取 pending source folder
const getPendingSourceFolderOptions = async () => {
  const response = await captureAndLog(() => getPendingSourceFolder());
  if (response === null || response === undefined || response.length === 0) {
    return;
  }
  pendingSourceFolderOptions.value = [];
  response.forEach(item => {
    pendingSourceFolderOptions.value.push({
      value: item,
      label: item
    });
  })
};
// modal 正确关闭的事件逻辑
const handleOk = () => {
  // 拼接 destFolderFullPath
  form.value.destFolderFullPath = destParentFolderFullPath.value + "/" + destFolderName.value;
  // 发起创建 syncFlow 请求
  createSyncFlow(form.value)
  // 清空状态
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
  showCreateSyncflowModal: async () => {
    isModalVisible.value = true;
    await getPendingSourceFolderOptions();
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
