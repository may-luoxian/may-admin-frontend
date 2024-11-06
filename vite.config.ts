import type { UserConfig, ConfigEnv } from 'vite';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import purgeIcons from 'vite-plugin-purge-icons';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import eslintPlugin from 'vite-plugin-eslint';
import { viteMockServe } from 'vite-plugin-mock';

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
    plugins: [
      vue(),
      configSvgIconsPlugin(isBuild),
      purgeIcons(),
      eslintPlugin({
        include: ['src/**/*.ts', 'src/**/*.vue', 'src/*.ts', 'src/*.vue'],
      }),
      viteMockServe({
        mockPath: 'mock',
        localEnabled: command === 'serve',
      }),
    ],
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
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
    },
    server: {
      host: '0.0.0.0',
      port: 8100,
      proxy: {
        '/api': {
          // target: 'http://localhost:8080',
          target: 'http://localhost:8090',
          // target: 'http://49.232.158.14:8080',
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
    build: {
      sourcemap: false,
      minify: 'terser',
      chunkSizeWarningLimit: 1500,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          },
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : [];
            const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]';
            return `js/${fileName}/[name].[hash].js`;
          },
        },
      },
    },
  };
});
