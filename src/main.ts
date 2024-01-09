import { createApp } from 'vue';
import App from '@/App.vue';
import router from './router';
import { setupPinia } from './stores';
// 国际化
import { i18n } from './locales';

import { components, plugins } from '@/plugins/element-plus';
import { ElNotification } from 'element-plus';

// 路由守卫
import '@/router/guard';

// 全局样式文件
import '@/design/base.scss';

// 引入tailwindcss文件
import 'tailwindcss/tailwind.css';

// element-plus样式文件
import 'element-plus/theme-chalk/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';

// 注册icon图标
import 'virtual:svg-icons-register';
import '@/assets/css/iconfont.css';

export const app = createApp(App);
setupPinia(app);
app.use(router);
app.use(i18n);

app.config.globalProperties.$notify = ElNotification;

components.forEach((component) => {
  app.component(component.name, component);
});
plugins.forEach((plugin) => {
  app.use(plugin);
});

app.mount('#app');
