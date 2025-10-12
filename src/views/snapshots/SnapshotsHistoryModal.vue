<template>
  <a-modal
      v-model:open="isModalVisible"
      @ok="() => isModalVisible = false"
      @cancel="() => isModalVisible = false"
      title="Snapshots History"
      width="1300px"
      :centered="true"
      :destroyOnClose="true">
    <a-layout class="file-browser-container">
      <!-- 标题 -->
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
                    @click="previewFileFunc(record)">
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
          :centered="true"
          :destroyOnClose="true"
          class="preview-modal">
        <div class="preview-content">
          <!-- 图片预览 -->
          <a-image
              v-if="previewFileType === 'image' && previewUrl"
              :src="previewUrl"
              class="preview-image"/>

          <!-- TXT 预览 -->
          <iframe
              v-else-if="previewFileType === 'text' && previewUrl"
              :src="previewUrl"
              class="preview-text"/>

          <!-- PDF 预览 -->
          <iframe
              v-else-if="previewFileType === 'pdf' && previewUrl"
              :src="previewUrl"
              class="preview-pdf"/>

          <!-- 其他类型 -->
          <div v-else class="unsupported-preview">
            <file-unknown-outlined class="preview-icon" />
            <p>不支持预览此文件类型</p>
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
import {submitDownloadJob, getDownloadFiles, getSnapshotFileInfo} from "../../api/Api";
import {captureAndLog} from "../../util/ExceptionHandler";
import {AxiosResponse} from "axios";
import {message} from 'ant-design-vue';
import {getFileExtension} from "../../util/FileUtil";

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
// 文件预览模态框可见性
const previewVisible = ref<boolean>(false);
// 预览的文件类型
const previewFileType = ref<"image" | "text" | "pdf" | "other" | null>(null);
// 预览的文件URL
const previewUrl = ref<string>("");
// 预览的标题
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
const previewFileFunc = async (snapshotFileInfo: SnapshotFileInfo) => {
  previewVisible.value = true;
  previewTitle.value = `预览: ${snapshotFileInfo.fileName}`;
  // 请求文件
  const response = await captureAndLog(() => downloadFileInner(snapshotFileInfo, true));
  if (response === null || response === undefined) {
    previewFileType.value = "other";
    return;
  }
  // 根据文件扩展名确定文件类型
  const ext = getFileExtension(snapshotFileInfo.fileName);
   if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
    previewFileType.value = "image";
     previewUrl.value = window.URL.createObjectURL(new Blob([response.data]));
  } else if (["txt"].includes(ext)) {
    previewFileType.value = "text";
     previewUrl.value = window.URL.createObjectURL(new Blob([response.data]));
  } else if ("pdf" === ext) {
     previewFileType.value = "pdf";
     previewUrl.value = "pdfjs/web/viewer.html?file=" + window.URL.createObjectURL(new Blob([response.data]));
   } else {
     previewFileType.value = "other";
     return;
   }
};

// 下载单个文件/文件夹
const downloadFile = async (snapshotFileInfo:SnapshotFileInfo, isPreview:boolean=false) => {
  loading.value = true;

  try {
    const response = await captureAndLog(() => downloadFileInner(snapshotFileInfo, isPreview));
    let filename:string;
    // 从响应头中获取 Content-Disposition
    const contentDisposition = response.headers['content-disposition'];
    // 解析文件名（示例：处理 UTF-8 编码和引号）
    if (contentDisposition) {
      const filenameRegex = /filename\*?=([^;]+)/gi;
      const matches = filenameRegex.exec(contentDisposition);
      if (matches != null && matches[1]) {
        // 处理类似 "UTF-8''filename.ext" 或 "filename.ext" 的情况
        filename = decodeURIComponent(matches[1].replace(/^UTF-8''/i, ''));
        // 去除可能的引号
        filename = filename.replace(/['"]/g, '');
      }
    }
    if (filename === null || filename === undefined) {
      // 弹窗异常
      message.error("服务器异常, filename 为空");
      return;
    }
    // 设置 url 和 link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    // 触发下载
    document.body.appendChild(link);
    link.click();
    // 清理
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (e) {
    console.groupCollapsed('Snapshots Error Handler');
    console.error("file download failed. ", e);
    console.groupEnd();
  } finally {
    loading.value = false;
  }
};

const downloadFileInner = async (
    snapshotFileInfo:SnapshotFileInfo, isPreview:boolean=false):Promise<AxiosResponse<Blob>> => {
  // 参数检查
  if (snapshotFileInfo === null) {
    throw new Error("No snapshotFileInfo");
  }
  if (isPreview && snapshotFileInfo.type !== "file") {
    throw new Error("only supports preview file");
  }
  const downloadJobId = await captureAndLog(() => submitDownloadJob([snapshotFileInfo]));
  if (downloadJobId === null || downloadJobId === undefined) {
    throw new Error("服务器没有返回 downloadJobId");
  }
  // 重试三次, 最长 15 秒
  for (let i = 0; i < 3; i++) {
    const response = await captureAndLog(() => getDownloadFiles(downloadJobId, isPreview));
    if (response.status === 200) {
      return response;
    } else if (response === null || response === undefined) {
      // 弹窗异常
      throw new Error("服务器异常, response 为空");
    }
    // 等待 5 秒
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

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
  height: 100vh;
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
</style>
