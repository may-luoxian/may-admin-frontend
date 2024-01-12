export type LocaleType = 'zh_CN' | 'en';
export const MAY_STORAGE = 'may_blog';

export const MAY_BLOG_TOKEN = 'may_blog_token';

export const LOCALE: { [key: string]: LocaleType } = {
  ZH_CN: 'zh_CN',
  EN_US: 'en',
};

export const LocaleList = [
  {
    event: LOCALE.ZH_CN,
    text: '简体中文',
  },
  {
    event: LOCALE.EN_US,
    text: 'English',
  },
];
