<template>
  <a-auto-complete
      v-model:value="input"
      :options="options"
      @search="onSearch"
  />
</template>

<script lang="ts" setup>
import {Ref, ref} from 'vue';
import {getFolderName} from "../api/api";
import {Folder} from "../api/FileSystemAccessDataType";

// 定义联想内容的格式
interface OptionValue {
  value: string;
}
// 定义联想的内容
const options:Ref<OptionValue[]> = ref([]);
// 定义联想内容搜索的函数
const searchFolder = async (searchText: string) => {
  const folders:Folder[] = await getFolderName(searchText)
  if (folders === null || folders === undefined || folders.length === 0) {
    options.value = [];
    return;
  }
  let result: OptionValue[] = [];
  for (let i = 0; i < folders.length; i++) {
    result.push({
      value: folders[i].folderFullPath,
    })
  }
  options.value = result;
};
// 定义用户的输入
const input = defineModel();
// 根据用户的输入搜索文件夹, 并改变联想的内容
const onSearch = (searchText: string) => {
  if (!searchText) {
    options.value = [];
  } else {
    searchFolder(searchText);
  }
};
</script>