/* eslint-disable @typescript-eslint/ban-types */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const vueComponent: DefineComponent<{}, {}, any>;
  export default vueComponent;
}
