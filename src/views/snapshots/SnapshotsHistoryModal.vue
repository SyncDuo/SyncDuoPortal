<template>
  <a-modal
      v-model:open="isModalVisible"
      title="Snapshots History"
      width="1300px"
  >
    <a-layout class="file-browser-container">
      <a-layout-header class="header">
        <h1>文件浏览器</h1>
      </a-layout-header>

      <a-layout-content class="content">
        <!-- 面包屑导航 -->
        <a-breadcrumb class="breadcrumb">
          <a-breadcrumb-item>
            <a @click="goToRoot">根目录</a>
          </a-breadcrumb-item>
          <a-breadcrumb-item v-for="(path, index) in breadcrumbs" :key="index">
            <a @click="navigateTo(index)">{{ path }}</a>
          </a-breadcrumb-item>
        </a-breadcrumb>

        <!-- 文件列表表格 -->
        <a-table
            :data-source="fileList"
            :columns="columns"
            :pagination="false"
            :loading="loading"
            row-key="name"
            class="file-table"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
              <div class="file-name-cell">
                <file-outlined v-if="record.type === 'file'" class="file-icon" />
                <folder-outlined v-if="record.type === 'dir'" class="folder-icon"/>
                <a v-if="record.type === 'dir'" @click="openDirectory(record.fileName)">
                  {{ record.fileName }}
                </a>
                <span v-else>{{ record.fileName }}</span>
              </div>
            </template>
            <template v-else-if="column.key === 'size'">
              {{ record.size }} MB
            </template>
            <template v-else-if="column.key === 'modified'">
              {{ record.lastModifiedTime }}
            </template>
            <template v-else-if="column.key === 'actions'">
              <a-space>
                <a-button
                    v-if="record.type === 'file'"
                    type="primary"
                    size="small"
                    @click="previewFile(record)"
                >
                  预览
                </a-button>

                <a-button type="primary" size="small" @click="downloadFile(record)">下载</a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-layout-content>

      <!-- 文件预览模态框 -->
      <a-modal
          v-model:open="previewVisible"
          :title="previewTitle"
          width="80%"
          :footer="null"
          centered
          destroyOnClose
          class="preview-modal"
      >
        <div class="preview-content">
          <!-- 图片预览 -->
          <img
              v-if="previewFileType === 'image' && previewUrl"
              :src="previewUrl"
              alt="预览图"
              class="preview-image"
          />

          <!-- 文本预览 -->
          <a-textarea
              v-else-if="previewFileType === 'text' && previewContent"
              :value="previewContent"
              readonly
              auto-size
              class="preview-text"
          />

          <!-- PDF预览 -->
          <iframe
              v-else-if="previewFileType === 'pdf' && previewUrl"
              :src="previewUrl"
              frameborder="0"
              class="preview-pdf"
          ></iframe>

          <!-- 其他类型 -->
          <div
              v-else-if="previewFileType === 'other'"
              class="unsupported-preview"
          >
            <file-unknown-outlined class="preview-icon" />
            <p>不支持预览此文件类型</p>
          </div>

          <!-- 加载状态 -->
          <div v-else class="loading-preview">
            <a-spin size="large" />
            <p>加载预览中...</p>
          </div>
        </div>
      </a-modal>
    </a-layout>
  </a-modal>
</template>

<script setup lang="ts">
import {ref, Ref} from "vue";
import {FileOutlined, FileUnknownOutlined, FolderOutlined,} from "@ant-design/icons-vue";
import {SnapshotFileInfo} from "../../api/SnapshotsDataType";
import {downloadSnapshotFile, downloadSnapshotFiles, getSnapshotFileInfo} from "../../api/api";
import {SyncDuoHttpResponse} from "../../api/GlobalDataType";

// modal 是否打开的变量
const isModalVisible:Ref<boolean> = ref(false);
// modal 传入的 snapshotId
const backupJobId:Ref<string> = ref<string>("");

// 表格列定义
const columns = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    width: "45%",
  },
  {
    title: "大小",
    dataIndex: "size",
    key: "size",
    width: "15%",
  },
  {
    title: "修改日期",
    dataIndex: "modified",
    key: "modified",
    width: "25%",
  },
  {
    title: "操作",
    key: "actions",
    width: "15%",
  },
];
// 文件列表
const fileList = ref<SnapshotFileInfo[]>([]);
// 文件列表加载状态
const loading = ref<boolean>(true);
// 预览模态框可见性
const previewVisible = ref<boolean>(false);
// 预览文件类型
const previewFileType = ref<"image" | "text" | "pdf" | "other" | null>(null);
// 预览文件URL
const previewUrl = ref<string>("");
// 预览文本内容
const previewContent = ref<string>("");
// 预览标题
const previewTitle = ref<string>("文件预览");

// 获取文件列表
const fetchFiles = async () => {
  try {
    loading.value = true;
    if (!backupJobId || backupJobId.value === "") {
      console.error("backupJobId must be specified!");
      return;
    }
    fileList.value = await getSnapshotFileInfo(backupJobId.value, currentPath.value);
  } catch (error) {
    console.error("获取文件列表失败:", error);
  } finally {
    loading.value = false;
  }
};

// 面包屑当前路径
const currentPath = ref<string>("/");
// 面包屑值, 面包屑导航中不包括根路径
const breadcrumbs = ref<string[]>([]);
// 打开目录
const openDirectory = async (dirName: string) => {
  // 当前路径拼接目标文件夹
  currentPath.value = `${currentPath.value}${dirName}/`;

  // 从当前路径中提取面包屑部分（排除首尾的斜杠）, 并更新
  breadcrumbs.value = currentPath.value.split("/").filter((part) => part);

  // 刷新文件列表
  await fetchFiles();
};

// 返回根目录
const goToRoot = async () => {
  currentPath.value = "/";
  breadcrumbs.value = [];
  await fetchFiles();
};

// 导航到面包屑中的路径
const navigateTo = async (index: number) => {
  // 点击当前路径,不跳转
  if (index === breadcrumbs.value.length - 1) return;

  // 新面包屑 = 旧的面包屑截取 0~index 的元素
  breadcrumbs.value = breadcrumbs.value.slice(0, index + 1);

  // 新路径 = 根路径("/") 拼接面包屑中的路径(使用"/"拼接)
  currentPath.value = "/" + breadcrumbs.value.join("/");

  await fetchFiles();
};

// 预览文件
const previewFile = (file: SnapshotFileInfo) => {
  previewVisible.value = true;
  previewTitle.value = `预览: ${file.fileName}`;

  // 根据文件扩展名确定文件类型
  const ext = file.fileName.split(".").pop()?.toLowerCase();

  // 模拟不同类型的预览处理
  if (["jpg", "jpeg", "png", "gif"].includes(ext || "")) {
    previewFileType.value = "image";
    // 实际项目中，这里应该通过API获取文件URL
    previewUrl.value = `https://picsum.photos/800/600?random=${Math.floor(
        Math.random() * 100
    )}`;
  } else if (["txt", "js", "ts", "html", "css", "json"].includes(ext || "")) {
    previewFileType.value = "text";
    // 模拟文本内容
    previewContent.value =
        `这是文件 ${file.fileName} 的模拟内容。\n\n` +
        `文件大小: ${file.size}\n` +
        `修改时间: ${file.lastModifiedTime}\n\n` +
        "在实际项目中，这里会显示文件的实际文本内容。";
  } else if (ext === "pdf") {
    previewFileType.value = "pdf";
    // 模拟PDF文件
    previewUrl.value =
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
  } else {
    previewFileType.value = "other";
  }
};

// 下载文件
const downloadFile = async (snapshotFileInfo:SnapshotFileInfo) => {
  let syncDuoHttpResponse: SyncDuoHttpResponse;
  if (snapshotFileInfo.type === "file") {
    syncDuoHttpResponse = await downloadSnapshotFile(snapshotFileInfo);
  } else {
    syncDuoHttpResponse = await downloadSnapshotFiles([snapshotFileInfo]);
  }
  if (syncDuoHttpResponse != null) {
    console.error("download file failed. ex: " + syncDuoHttpResponse.message);
  }
};

// 定义需要暴露的方法
defineExpose({
  // 控制 modal 显示隐藏的方法
  showModal: async (backupJobIdArg:string) => {
    isModalVisible.value = true;
    // 设置 backupJobId 并刷新文件列表
    backupJobId.value = backupJobIdArg;
    await fetchFiles();
  }
});
</script>

<style scoped>
.file-browser-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.header {
  background-color: #1890ff;
  color: white;
  text-align: center;
  padding: 0 20px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.header h1 {
  color: white;
  margin: 0;
  font-size: 1.5rem;
}

.content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.breadcrumb {
  margin-bottom: 20px;
  padding: 10px 15px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  flex-shrink: 0;
}

.file-table {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  flex: 1;
  overflow: auto;
}

.file-name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-icon {
  color: #1890ff;
}

.folder-icon {
  color: #faad14;
}

.preview-modal {
  padding: 0;
  height: 70vh;
}

.preview-content {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.preview-image {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

.preview-text {
  width: 100%;
  height: 100%;
  font-family: monospace;
}

.preview-pdf {
  width: 100%;
  height: 100%;
}

.unsupported-preview {
  text-align: center;
  padding: 40px;
}

.preview-icon {
  font-size: 64px;
  color: #1890ff;
  margin-bottom: 20px;
}

.loading-preview {
  text-align: center;
  padding: 40px;
}
</style>
