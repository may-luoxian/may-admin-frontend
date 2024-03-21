<!-- 题目列表 -->
<template>
  <div>
    <el-header class="may-title">
      <span>题目列表</span>
      <div class="float-right h-full leading-10 flex items-center">
        <el-input v-model="queryParams.title" placeholder="请输入菜单名称" clearable style="width: 260px; margin-right: 16px" />
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </div>
    </el-header>
    <div class="may-container fix">
      <el-table ref="tableRef" :tree-props="{ children: 'children' }" row-key="id" size="large"> </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, onMounted, reactive } from 'vue';

onMounted(() => {
  init();
});

const init = () => {
  getQuestionList();
};

interface QueryParams {
  title?: string;
}

const queryParams = reactive<QueryParams>({});

const getQuestionList = () => {};

const handleSearch = () => {
  getQuestionList();
};
</script>

<style lang="scss" scoped></style>
