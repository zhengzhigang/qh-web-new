
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

// windi
// import 'virtual:windi.css'
// import 'virtual:windi-base.css's
// import 'virtual:windi-components.css'
import 'virtual:windi-utilities.css'

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { createPinia } from 'pinia';

const pinia = createPinia();
const app = createApp(App);
app.use(router).use(ElementPlus).use(pinia).mount('#app');


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
