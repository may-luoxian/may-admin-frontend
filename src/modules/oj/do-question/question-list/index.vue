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
      <el-table ref="tableRef" :data="tableData">
        <el-table-column align="center" label="标题" prop="title"></el-table-column>
        <el-table-column align="center" label="标签" prop="tags">
          <template #default="scope">
            <el-tag el-tag class="mr-2" size="large" v-for="tag in scope.row.tags" :key="tag">{{ tag }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="提交数" prop="submitNum"></el-table-column>
        <el-table-column align="center" label="通过数" prop="acceptNum"></el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="scope">
            <el-button type="primary" link @click="handleDoQuestion(scope.row)">做题</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { defHttp } from '@/utils/http/axios';
import router from '@/router';

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
const tableData = ref([]);

const getQuestionList = () => {
  defHttp
    .get({
      url: '/oj/question/',
    })
    .then((res) => {
      tableData.value = res.data;
    });
};

/**
 * 查询题目列表
 */
const handleSearch = () => {
  getQuestionList();
};

/**
 * 做题
 */
const handleDoQuestion = (row: any) => {
  router.push({
    path: `/oj/do-question/preview-question/${row.id}`,
  });
};
</script>

<style lang="scss" scoped></style>
