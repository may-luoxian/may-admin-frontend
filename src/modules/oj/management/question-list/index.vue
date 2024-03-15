<!-- 题目列表 -->
<template>
  <div>
    <el-header class="may-title">
      <span>题目列表</span>
    </el-header>
    <div class="may-container fix">
      <el-table ref="tableRef" :tree-props="{ children: 'children' }" row-key="id" size="large"> </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, onMounted } from 'vue';

onMounted(() => {
  init();
});

const init = () => {
  getResourceList();
};

const getResourceList = () => {};

const handleSearch = () => {
  getResourceList();
};
</script>

<style lang="scss" scoped></style>
