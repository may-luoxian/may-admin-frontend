<template>
  <!-- 容器 -->
  <div ref="homeRef" class="home bg-style2 p-4 overflow-auto" :style="{ height: homeHeight + 'px' }">
    <!-- 门户块 -->
    <el-row ref="elRow" :gutter="10">
      <el-col class="mb-2" :span="setItemSpan(item.widthValue)" v-for="item in homeList" :key="item.id">
        <!-- 日历图 -->
        <home-calendar :ref="(el) => setItemRef(el, item.component)" :title="item.name" :theme="themeConfig.theme" @refreshHome="refreshHome" @editHome="editHome" @hiddenHome="hiddenHome" v-if="item.component === HOME.HOME_Calendar" />
        <!-- home-demo2 -->
        <home-demo2 :ref="(el) => setItemRef(el, item.component)" :title="item.name" :theme="themeConfig.theme" @refreshHome="refreshHome" @editHome="editHome" @hiddenHome="hiddenHome" v-if="item.component === HOME.HOME_DEMO2" />
        <!-- home-demo3 -->
        <home-demo3 :ref="(el) => setItemRef(el, item.component)" :title="item.name" :theme="themeConfig.theme" @refreshHome="refreshHome" @editHome="editHome" @hiddenHome="hiddenHome" v-if="item.component === HOME.HOME_DEMO3" />
        <!-- home-demo4 -->
        <home-demo4 :ref="(el) => setItemRef(el, item.component)" :title="item.name" :theme="themeConfig.theme" @refreshHome="refreshHome" @editHome="editHome" @hiddenHome="hiddenHome" v-if="item.component === HOME.HOME_DEMO4" />
        <!-- home-demo5 -->
        <home-demo5 :ref="(el) => setItemRef(el, item.component)" :title="item.name" :theme="themeConfig.theme" @refreshHome="refreshHome" @editHome="editHome" @hiddenHome="hiddenHome" v-if="item.component === HOME.HOME_DEMO5" />
        <!-- home-demo6 -->
        <home-demo6 :ref="(el) => setItemRef(el, item.component)" :title="item.name" :theme="themeConfig.theme" @refreshHome="refreshHome" @editHome="editHome" @hiddenHome="hiddenHome" v-if="item.component === HOME.HOME_DEMO6" />
        <!-- home-demo7 -->
        <home-demo7 :ref="(el) => setItemRef(el, item.component)" :title="item.name" :theme="themeConfig.theme" @refreshHome="refreshHome" @editHome="editHome" @hiddenHome="hiddenHome" v-if="item.component === HOME.HOME_DEMO7" />
        <!-- home-demo8 -->
        <home-demo8 :ref="(el) => setItemRef(el, item.component)" :title="item.name" :theme="themeConfig.theme" @refreshHome="refreshHome" @editHome="editHome" @hiddenHome="hiddenHome" v-if="item.component === HOME.HOME_DEMO8" />
      </el-col>
    </el-row>
    <!-- 门户坞 -->
    <home-dock />
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, reactive, watch } from 'vue';
import { defHttp } from '@/utils/http/axios';
import { defineAsyncComponent, ref } from 'vue';
import { HOME } from '@/modules/home/constant';
import { useDomControlsHook } from '@/hooks/domControls';
import { useAppStore } from '@/stores/modules/app';

const homeRef = ref();
let homeHeight = useDomControlsHook(homeRef) || 0;

/**
 * 异步引入各个门户块
 */
const homeCalendar = defineAsyncComponent(() => import('@/modules/home/home-calendar/index.vue'));
const homeDemo2 = defineAsyncComponent(() => import('@/modules/home/home-demo2/index.vue'));
const homeDemo3 = defineAsyncComponent(() => import('@/modules/home/home-demo3/index.vue'));
const homeDemo4 = defineAsyncComponent(() => import('@/modules/home/home-demo4/index.vue'));
const homeDemo5 = defineAsyncComponent(() => import('@/modules/home/home-demo5/index.vue'));
const homeDemo6 = defineAsyncComponent(() => import('@/modules/home/home-demo6/index.vue'));
const homeDemo7 = defineAsyncComponent(() => import('@/modules/home/home-demo7/index.vue'));
const homeDemo8 = defineAsyncComponent(() => import('@/modules/home/home-demo8/index.vue'));
const homeDock = defineAsyncComponent(() => import('@/modules/home/home-dock/index.vue'));

/**
 * 获取子组件面板ref
 */
const panelRef: any = reactive({});
const setItemRef = (el: any, component: string) => {
  panelRef[component] = el;
};

/**
 * 监听风格切换刷新Echarts
 */
const { themeConfig } = useAppStore();
watch(
  () => themeConfig.theme,
  (nv) => {
    nextTick(() => {
      handleEchartsTheme(nv ? 'dark' : 'light');
    });
  }
);

const homeList = ref();

onMounted(() => {
  init();
});

/**
 * 初始化
 * 1、获取用户可展示门户
 */
const init = () => {
  defHttp
    .get({
      url: '/admin/home/list',
    })
    .then((res) => {
      if (res.code === 20000) {
        homeList.value = res.data;
      }
    });
};

/**
 * 设置各个门户块宽度
 */
const setItemSpan = (widthValue: number) => {
  switch (widthValue) {
    case 1:
      return 6;
    case 2:
      return 8;
    case 3:
      return 12;
    case 4:
      return 16;
    case 5:
      return 24;
    default:
      return 6;
  }
};

/**
 * 处理门户块刷新
 */
const refreshHome = () => {};

/**
 * 处理门户块编辑
 */
const editHome = () => {};

/**
 * 处理门户块隐藏
 */
const hiddenHome = () => {};

/**
 * 处理门户块Echarts风格切换
 */
const handleEchartsTheme = (theme: string) => {
  Object.keys(panelRef).forEach((component) => {
    panelRef[component].initEcharts && panelRef[component].initEcharts(theme);
  });
};
</script>

<style lang="scss" scoped></style>
