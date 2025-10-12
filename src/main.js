import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {createPinia} from "pinia";

const app = createApp(App).use(createPinia());

app.config.errorHandler = (err, instance, info) => {
    // err: 错误对象
    // instance: 发生错误的组件实例
    // info: Vue 特定的错误信息，如错误所在的生命周期钩子:cite[2]:cite[4]
    console.groupCollapsed('Vue Error Handler');
    console.error('捕获到全局错误：', err);
    console.error('出错的组件实例：', instance);
    console.error('错误信息：', info);
    console.groupEnd();
};

app.mount('#app')