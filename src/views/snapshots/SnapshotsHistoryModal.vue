<template>
  <a-modal
      v-model:open="isModalVisible"
      title="Snapshots History"
      @ok="handleOk"
      @cancel="() => isModalVisible = false"
      @close="() => isModalVisible = false"
      width="1000px"
  >

  </a-modal>
</template>

<script setup lang="ts">
import {createSystemConfig, getSnapshots, getSystemConfig, updateSystemConfig} from '../../api/api';
import {onMounted, ref, Ref, watch} from 'vue';
import SearchBar from "../../components/SearchPathInput.vue";
import {SystemConfigEntity, SystemConfigResponse} from "../../api/SystemConfigDataType";
import {loadPublicKey} from '../../util/rsa';
import JSEncrypt from 'jsencrypt';
import {CopyOutlined} from "@ant-design/icons-vue";
import {SnapshotInfo, SnapshotsResponse} from "../../api/SnapshotsDataType";
import {formatTimestamp} from "../../util/DateUtil";

// modal 是否打开的变量
const isModalVisible:Ref<boolean> = ref(false);
// modal 加载的时候获取 files 数据
onMounted(async () => {

})
// modal 正确关闭的事件逻辑
const handleOk = async () => {
  console.log("closing snapshots history modal");
  isModalVisible.value = false;
};
// 定义需要暴露的方法
defineExpose({
  // 控制 modal 显示隐藏的方法
  showModal: () => {
    isModalVisible.value = true;
  }
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
