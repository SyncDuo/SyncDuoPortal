import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {createPinia} from "pinia";

// todo: 1. 异常处理 3. ts 代码引入 class, 精简代码和增加项目健壮性 4. 文件下载提示 5.
createApp(App)
    .use(createPinia())
    .mount('#app')