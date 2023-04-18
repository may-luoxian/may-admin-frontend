import type { LocaleType } from "#/config";

export const LOCALE: { [key: string]: LocaleType } = {
  ZH_CN: "zh_CN",
  EN_US: "en",
};

export const LocaleList = [
  {
    event: LOCALE.ZH_CN,
    text: "简体中文",
  },
  {
    event: LOCALE.EN_US,
    text: "English",
  },
];
