import { defineStore } from 'pinia';
import { i18n } from '@/locales';

//auto 亮色 dark暗黑
const themeSetting = String(localStorage.getItem('may-blog-theme')) === 'auto' ? false : true;
export const useAppStore = defineStore('app', {
  state: () => {
    return {
      themeConfig: {
        theme: themeSetting,
      },
    };
  },
  getters: {
    //true 暗黑模式
    getTheme(): boolean {
      return this.themeConfig.theme;
    },
  },
  actions: {
    toggleTheme(isDark: boolean) {
      this.themeConfig.theme = isDark;
    },
    changeLocale(locale: string) {
      localStorage.setItem('may-blog-locale', locale);
      i18n.global.locale.value = locale;
    },
  },
});
