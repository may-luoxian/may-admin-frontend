import type { UserConfig, ConfigEnv } from 'vite';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import purgeIcons from 'vite-plugin-purge-icons';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

//项目运行时路径
function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

//配置svg图标
function configSvgIconsPlugin(isBuild: boolean) {
  const svgIconPlugin = createSvgIconsPlugin({
    //需要缓存的图标文件夹
    iconDirs: [pathResolve('src/assets/icons')],
    svgoOptions: isBuild,
    //指定symbolId格式
    symbolId: 'icon-[dir]-[name]',
  });
  return svgIconPlugin;
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const isBuild = command === 'build';
  return {
    base: './',
    plugins: [vue(), configSvgIconsPlugin(isBuild), purgeIcons()],
    // vite通过postcss引入tailwindcss
    css: {
      postcss: {
        plugins: [require('tailwindcss'), require('autoprefixer')],
      },
    },
    resolve: {
      alias: [
        {
          find: /@\//,
          replacement: pathResolve('src') + '/',
        },
        {
          find: /#\//,
          replacement: pathResolve('types') + '/',
        },
      ],
    },
    server: {
      host: '0.0.0.0',
      port: 8082,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          // target: 'http://localhost:8081',
          // target: "http://www.luoxian.tech:8080",
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        // '/socket': {
        //   target: 'ws://localhost:3000',
        //   changeOrigin: true,
        //   ws: true,
        //   rewrite: (path) => path.replace(/^\/socket/, ''),
        // }
      },
    },
  };
});
