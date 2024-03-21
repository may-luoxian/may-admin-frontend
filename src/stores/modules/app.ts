import { defineStore } from 'pinia';
import { i18n } from '@/locales';

export const useAppStore = defineStore('app', {
  state: () => {
    return {
      themeConfig: {
        theme: false,
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
