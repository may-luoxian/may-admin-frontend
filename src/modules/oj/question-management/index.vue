<!-- 题目列表 -->
<template>
  <div class="may-container">
    <div class="may-card min-container-h relative">
      <el-header class="may-title">
        <span>题目管理</span>
        <div class="float-right h-full leading-10 flex items-center">
          <el-input v-model="queryParams.title" placeholder="请输入题目名称" clearable style="width: 260px; margin-right: 16px" />
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </div>
      </el-header>
      <el-table ref="tableRef" :data="tableData" border stripe>
        <el-table-column align="center" label="标题" prop="title"></el-table-column>
        <el-table-column align="center" label="难度" prop="difficulty">
          <template #default="scope">
            <el-tag effect="dark" :type="filterDifficultyTag(scope.row.difficulty)">{{ filterDifficulty(scope.row.difficulty) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="标签" prop="tags">
          <template #default="scope">
            <el-tag class="mr-2" v-for="item in scope.row.tags" :key="item.id">{{ item.tag }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="提交数" prop="submitNum"></el-table-column>
        <el-table-column align="center" label="通过数" prop="acceptNum"></el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="scope">
            <el-button type="primary" link @click="handleModify(scope.row)">修改</el-button>
            <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" title="确定删除该题目吗？" :width="180" @confirm="handleDelete(scope.row)" @cancel="() => {}">
              <template #reference>
                <el-button type="danger" link>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="p-2 absolute bottom-1 w-full">
        <el-pagination v-model:current-page="queryParams.current" v-model:page-size="queryParams.size" :page-sizes="[10, 20, 50]" :total="total" background layout="total, sizes, prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="float: right" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { onMounted, reactive, ref } from 'vue';
import { defHttp } from '@/utils/http/axios';
import { ElNotification } from 'element-plus';
import { QuestionDifficulty } from '@/modules/oj/constant';

onMounted(() => {
  init();
});

const init = () => {
  getQuestionList();
};

interface QueryParams {
  title?: string;
  current: number;
  size: number;
}

const queryParams = reactive<QueryParams>({
  current: 1,
  size: 10,
});
let total = ref(0);
const tableData = ref([]);

const getQuestionList = () => {
  defHttp
    .get({
      url: '/oj/question/',
    })
    .then((res) => {
      tableData.value = res.data.records;
      total.value = res.data.count;
    });
};

/**
 * 查询题目列表
 */
const handleSearch = () => {
  getQuestionList();
};

/**
 * 修改题目
 */
const handleModify = (row: any) => {
  router.push({
    path: `/oj/save-question/${row.id}`,
  });
};
/**
 * 删除题目
 */
const handleDelete = (row: any) => {
  defHttp
    .delete({
      url: '/oj/question/',
      data: [row.id],
    })
    .then((res) => {
      ElNotification({
        type: 'success',
        title: 'Success',
        message: res.message,
      });
      getQuestionList();
    })
    .catch((err) => {
      ElNotification({
        type: 'error',
        title: 'Error',
        message: err,
      });
      console.error(err);
    });
};

const handleSizeChange = (size: number) => {
  queryParams.size = size;
  handleSearch();
};
const handleCurrentChange = (current: number) => {
  queryParams.current = current;
  handleSearch();
};

const filterDifficulty = (difficulty: number) => {
  return QuestionDifficulty.find((item: any) => {
    return item.id === difficulty;
  })?.value;
};

const filterDifficultyTag = (difficulty: number) => {
  return QuestionDifficulty.find((item: any) => {
    return item.id === difficulty;
  })?.type;
};
</script>

<style lang="scss" scoped>
.test {
  color: rgba($color: #372626, $alpha: 1);
}
</style>
