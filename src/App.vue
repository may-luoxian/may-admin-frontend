<script setup lang="ts">
import { defHttp } from '@/utils/http/axios';
import { onMounted } from 'vue';
import { useAppStore } from '@/stores/modules/app';
/**
 * 项目初始化
 * 1. 初始化风格
 */
const init = () => {
  let themeSetting = false;
  //auto 亮色 dark暗黑
  if (localStorage.getItem('may-blog-theme')) {
    themeSetting = ['auto', 'light'].includes(String(localStorage.getItem('may-blog-theme'))) ? false : true;
  }
  useAppStore().themeConfig.theme = themeSetting;

  defHttp.post({ url: '/management-center/info/report' });
};

onMounted(() => {
  init();
});
</script>

<template>
  <RouterView />
</template>
