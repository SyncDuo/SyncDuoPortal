<template>
  <a-auto-complete
      v-model:value="input"
      :options="options"
      @search="onSearch"
  />
</template>

<script lang="ts" setup>
import {Ref, ref, watch} from 'vue';
import {getFolderName} from "../api/api";
import {FileSystemResponse} from "../api/FileSystemDataType";

// 定义联想内容的格式
interface OptionValue {
  value: string;
}
// 定义联想的内容
const options:Ref<OptionValue[]> = ref([]);
// 定义联想内容搜索的函数
const searchFolder = async (searchText: string) => {
  const fileSystemResponse:FileSystemResponse = await getFolderName(searchText)
  if (fileSystemResponse === null) {
    console.error('Get Folder failed!');
    return;
  }
  if (fileSystemResponse.code === 500) {
    console.error('Get Folder failed. ' + fileSystemResponse.message);
    return;
  }
  if (fileSystemResponse.folderList === null || fileSystemResponse.folderList.length === 0) {
    options.value = [];
    return;
  }
  let result: OptionValue[] = [];
  for (let i = 0; i < fileSystemResponse.folderList.length; i++) {
    result.push({
      value: fileSystemResponse.folderList[i].folderFullPath,
    })
  }
  options.value = result;
};
// 定义暴露的 prop, 用于双向绑定
const props = defineProps({
  value: String
});
// 定义事件, 用于双向绑定
const emit = defineEmits<{
  (event: 'update:value', value: string): void;
}>();
// 定义用户的输入
const input:Ref<string> = ref(props.value);
// 定义 watch, 用于双向绑定
watch(input, (newValue: string) => {
  emit("update:value", newValue);
})
// 根据用户的输入搜索文件夹, 并改变联想的内容
const onSearch = (searchText: string) => {
  console.log('searchText');
  if (!searchText) {
    options.value = [];
  } else {
    searchFolder(searchText);
  }
};
</script>