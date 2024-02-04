<template>
  <!-- 容器 -->
  <div class="home bg-style2 p-4">
    <!-- 门户块 -->
    <el-row ref="elRow" :gutter="10">
      <el-col class="mb-2" :span="setItemSpan(item.widthValue)" v-for="item in homeList" :key="item.id">
        <home-demo1 :title="item.name" v-if="item.component === HOME.HOME_DEMO1" />
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

/**
 * 异步引入各个门户块
 */
const homeDemo1 = defineAsyncComponent(() => import('@/views/home/home-demo1/index.vue'));
const homeDemo2 = defineAsyncComponent(() => import('@/views/home/home-demo2/index.vue'));
const homeDemo3 = defineAsyncComponent(() => import('@/views/home/home-demo3/index.vue'));
const homeDemo4 = defineAsyncComponent(() => import('@/views/home/home-demo4/index.vue'));

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
</script>

<style lang="scss" scoped></style>
