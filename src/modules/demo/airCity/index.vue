<template>
  <div class="h-full">
    <div id="player" class="h-full"></div>
    <div>
      <el-button @click="reset">重置场景</el-button>
      <el-button @click="infoTree">查询图层树</el-button>
      <el-button @click="addMarker">添加标签</el-button>
      <el-button @click="moveCamera">相机移动</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { initAirCity, destoryAirCity, reset, infoTree, addMarker, moveCamera } from './js/airOptions';

onMounted(() => {
  initPlayer();
});

onBeforeUnmount(() => {
  destoryAirCity();
});

const initPlayer = () => {
  initAirCity();
};
</script>

<style lang="scss" scoped></style>
