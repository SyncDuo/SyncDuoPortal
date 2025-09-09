import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {createPinia} from "pinia";

// todo: 1. 异常处理 4. 文件下载提示 5. syncflow 更新过滤条件 6. 过滤条件改进
createApp(App)
    .use(createPinia())
    .mount('#app')