<template>
  <div class="header-content">
    <div class="title">
      <FileSyncOutlined class="logo" />
      <span class="syncduo">SyncDuo</span>
    </div>

    <span class="computer_name">{{ hostName }}</span>

    <a-dropdown class="dropdown_section">
      <template #overlay>
        <a-menu @click="handleMenuClick">
          <a-menu-item key="1">1st item</a-menu-item>
          <a-menu-item key="2">2nd item</a-menu-item>
          <a-menu-item key="3">3rd item</a-menu-item>
        </a-menu>
      </template>
      <a-button type="text">
        <SettingOutlined />
        <span class="actions">Actions</span>
        <DownOutlined />
      </a-button>
    </a-dropdown>
  </div>
</template>

<script setup >
import {FileSyncOutlined, SettingOutlined, DownOutlined} from '@ant-design/icons-vue';
import { getHostName} from "../api/api.js";
import {onMounted, ref} from "vue";


// 获取 hostName 并渲染
let hostName = ref('');
onMounted(async () => {
      await getHostName()
          .then(res => {
            hostName.value = res.hostName
          })
          .catch(err => console.log(err));
    }
)
// 处理菜单点击事件
const handleMenuClick = e => {
  console.log('click', e);
};
</script>

<style scoped>
.header-content {
  display: flex;
  align-items: center;  /* Vertically center the icon and text */
}

.logo {
  font-size: 32px;
  margin-left: 8px;
  color: #1e87b1; /* Optional: Set icon color */
}

.syncduo {
  font-size: 18px;
  font-weight: bold;
  color: #1e87b1; /* Optional: Set text color */
}

.computer_name {
  font-size: 18px;
  margin-left: 16px;
  margin-right: 100px;
  color: #696969; /* Optional: Set text color */
}
</style>
