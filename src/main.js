import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {createPinia} from "pinia";

// todo: 4. 文件下载提示 5. syncflow 更新过滤条件 6. 过滤条件改进
const app = createApp(App).use(createPinia());

app.config.errorHandler = (err, instance, info) => {
    // err: 错误对象
    // instance: 发生错误的组件实例
    // info: Vue 特定的错误信息，如错误所在的生命周期钩子:cite[2]:cite[4]
    console.error('捕获到全局错误：', err);
    console.error('出错的组件实例：', instance);
    console.error('错误信息：', info);

    // 区分环境处理
    if (import.meta.env.DEV) {
        // 开发环境：详细日志输出
        console.groupCollapsed('Vue Error Handler');
        console.error('Error:', err);
        console.log('Vue Instance:', instance);
        console.log('Error Info:', info);
        console.groupEnd();
    } else {
        // 生产环境：记录错误并友好提示
    }

    // 错误上报到监控系统（可选）
    // sendErrorToServer(err, { component: instance?.$options.name, info });:cite[1]
};

app.mount('#app')