import { createApp } from 'vue';
import App from '@/App.vue';
import router from './router';
import { setupPinia } from './stores';
import VueResizeObserver from 'vue-resize-observer';
import { registerObSkeleton } from '@/components/loadingSkeleton';
// 国际化
import { i18n } from './locales';

import { components, plugins } from '@/plugins/element-plus';
import { ElNotification } from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { SvgIcon } from './components/icon';

// 路由守卫
import '@/router/guard';

// 全局样式文件
import '@/design/base.scss';

// 引入tailwindcss文件
import 'tailwindcss/tailwind.css';

// element-plus样式文件
import 'element-plus/theme-chalk/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import '@/design/element-variables.scss';

// 注册icon图标
import 'virtual:svg-icons-register';
import '@/assets/css/iconfont.css';

// 引入echarts主题
import '@/design/echarts-theme/index';

export const app = createApp(App);
setupPinia(app);
app.use(router);
app.use(i18n);
app.use(VueResizeObserver);

app.config.globalProperties.$notify = ElNotification;

components.forEach((component) => {
  app.component(component.name, component);
});
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
const allGlobalComponents: any = { SvgIcon };
Object.keys(allGlobalComponents).forEach((componentName) => {
  app.component(componentName, allGlobalComponents[componentName]);
});

plugins.forEach((plugin) => {
  app.use(plugin);
});

registerObSkeleton(app);

app.mount('#app');
