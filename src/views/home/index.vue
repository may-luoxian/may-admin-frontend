<template>
  <div class="home">
    <span> 123 </span>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { defHttp } from '@/utils/http/axios';

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
      console.log(res);
    });
};
</script>

<style lang="scss" scoped></style>
