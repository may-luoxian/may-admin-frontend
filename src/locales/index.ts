import { createI18n } from 'vue-i18n';

interface LocaleItem {
  default: { [key: string]: { [key: string]: string } };
}

/**
 * 递归读取language下文件，按需引入
 */
function loadLocaleMessages(): {
  [key: string]: { [key: string]: { [key: string]: string } };
} {
  const locales: Record<string, LocaleItem> = import.meta.glob('./languages/*.ts', { eager: true });
  const messages: {
    [key: string]: { [key: string]: { [key: string]: string } };
  } = {};

  for (const path in locales) {
    messages[path.replace(/\.\/languages\/|\.ts/g, '')] = locales[path].default;
  }
  return messages;
}

/**
 * 国际化配置
 */
export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') ? String(localStorage.getItem('locale')) : 'zh_CN',
  fallbackLocale: localStorage.getItem('locale') ? String(localStorage.getItem('locale')) : 'zh_CN',
  messages: loadLocaleMessages(),
});
