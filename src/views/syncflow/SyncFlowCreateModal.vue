<template>
  <a-modal
      v-model:open="isModalVisible"
      title="Add SyncFlow"
      @ok="handleOk"
      @close="cleanUp"
      width="1000px"
      :destroyOnClose="true"
  >
    <a-tabs v-model:value="activeTab" type="card">
      <a-tab-pane key="basic" tab="Basic">
        <a-form class="input-group" layout="vertical">
          <a-form-item label="Sync Flow Type" class="form-item">
            <a-radio-group
                v-model:value="syncFlowType"
                :options="[SyncFlowType.REACTIVE_SYNC, SyncFlowType.BACKUP_ONLY]"
            />
          </a-form-item>
        </a-form>
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
          <a-form-item label="Dest Folder" class="form-item" v-if="syncFlowType === SyncFlowType.REACTIVE_SYNC">
            <a-input-group compact>
              <search-bar
                  v-model:value="destParentFolderFullPath"
                  :disabled="false"
                  style="width: 80%"/>
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

      <a-tab-pane key="advance" tab="Advance" v-if="syncFlowType === SyncFlowType.REACTIVE_SYNC">
        <a-form class="input-group" >
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
import {CreateSyncFlowRequest, SyncFlowType} from "../../api/SyncFlowDataType";
import SearchBar from "../../components/SearchPathInput.vue";
import {captureAndLog} from "../../util/ExceptionHandler";
import {SelectProps} from "ant-design-vue";

// modal 是否打开的变量
const isModalVisible:Ref<boolean> = ref(false);
// 活动 tab 页的变量
const activeTab:Ref<string> = ref("basic");
// syncflow type 选中的值和选中后处理的函数
const syncFlowType:Ref<SyncFlowType> = ref(SyncFlowType.REACTIVE_SYNC);
// source folder 输入框是否禁止的变量
const sourceFolderInputDisabled:Ref<boolean> = ref(false);
// 创建 destParentFolderFullPath 和 destFolderName, 用于最后拼接为 destFolderName
const destParentFolderFullPath:Ref<string> = ref("");
const destFolderName:Ref<string> = ref("");
// pending source folder
const pendingSourceFolderOptions:Ref<SelectProps['options']> = ref([]);
// modal 填写的数据
const form:Ref<CreateSyncFlowRequest> = ref({
  sourceFolderFullPath: "",
  destFolderFullPath: "",
  filterCriteria: "[]",
  syncFlowName: "",
  syncFlowType: SyncFlowType.UNKNOWN
});
// syncflow 创建完成后, 发送事件
const emit = defineEmits<{
  syncFlowCreated: [];
}>();
// 获取 pending source folder
const getPendingSourceFolderOptions = async () => {
  const response = await captureAndLog(() => getPendingSourceFolder());
  if (response === null || response === undefined) {
    return;
  }
  if (response.length === 0) {
    pendingSourceFolderOptions.value = [];
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
// modal 清空状态
const cleanUp = () => {
  isModalVisible.value = false;
  syncFlowType.value = SyncFlowType.REACTIVE_SYNC;
  sourceFolderInputDisabled.value = false;
  destParentFolderFullPath.value = "";
  destFolderName.value = "";
  form.value = {
    sourceFolderFullPath: "",
    destFolderFullPath: "",
    filterCriteria: "[]",
    syncFlowName: "",
    syncFlowType: SyncFlowType.UNKNOWN,
  }
};
// modal 正确关闭的事件逻辑
const handleOk = async () => {
  if (syncFlowType.value === SyncFlowType.REACTIVE_SYNC) {
    // 拼接 destFolderFullPath
    form.value.destFolderFullPath = destParentFolderFullPath.value + "/" + destFolderName.value;
  } else {
    form.value.destFolderFullPath = form.value.sourceFolderFullPath;
  }
  // 赋值 syncflow type
  form.value.syncFlowType = syncFlowType.value;
  // 发起创建 syncFlow 请求
  await captureAndLog(() => addSyncFlow(form.value));
  emit('syncFlowCreated');
  // 清空状态
  cleanUp();
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
