<template>
  <!-- 容器 -->
  <div ref="homeRef" class="home bg-style2 p-4 overflow-auto" :style="{ height: homeHeight + 'px' }">
    <!-- 门户块 -->
    <el-row ref="elRow" :gutter="10">
      <el-col class="mb-2" :span="setItemSpan(item.widthValue)" v-for="item in homeList" :key="item.id">
        <home-calendar :title="item.name" v-if="item.component === HOME.HOME_Calendar" />
        <home-demo2 :title="item.name" v-if="item.component === HOME.HOME_DEMO2" />
        <home-demo3 :title="item.name" v-if="item.component === HOME.HOME_DEMO3" />
        <home-demo4 :title="item.name" v-if="item.component === HOME.HOME_DEMO4" />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { defHttp } from '@/utils/http/axios';
import { defineAsyncComponent, ref } from 'vue';
import { HOME } from '@/views/constant/homeConstant';
import { useDomControlsHook } from '@/hooks/domControls';

/**
 * 异步引入各个门户块
 */
const homeCalendar = defineAsyncComponent(() => import('@/views/home/home-calendar/index.vue'));
const homeDemo2 = defineAsyncComponent(() => import('@/views/home/home-demo2/index.vue'));
const homeDemo3 = defineAsyncComponent(() => import('@/views/home/home-demo3/index.vue'));
const homeDemo4 = defineAsyncComponent(() => import('@/views/home/home-demo4/index.vue'));

const homeList = ref();
const homeRef = ref();
let homeHeight = useDomControlsHook(homeRef) || 0;

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
</script>

<style lang="scss" scoped></style>
