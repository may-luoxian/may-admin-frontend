<!-- 题目列表 -->
<template>
  <div class="may-container">
    <div class="flex gap-4 min-container-h">
      <div class="flex-shrink flex-grow w-2/3 min-w-40 may-card relative">
        <el-header class="may-title">
          <span>题目列表</span>
          <div class="float-right h-full leading-10 flex items-center">
            <el-input v-model="queryParams.title" placeholder="请输入题目名称" clearable style="width: 200px; margin-right: 16px" />
            <el-select v-model="queryParams.difficulty" placeholder="请选择题目难度" clearable style="width: 200px; margin-right: 16px">
              <el-option v-for="item in QuestionDifficulty" :key="item.id" :value="item.id" :label="item.value" />
            </el-select>
            <el-button type="primary" @click="handleReset">重置</el-button>
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </div>
        </el-header>
        <el-table ref="tableRef" :data="tableData" border stripe>
          <el-table-column align="center" label="标题" prop="title" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="难度" prop="difficulty">
            <template #default="scope">
              <el-tag effect="dark" :type="filterDifficultyTag(scope.row.difficulty)">{{ filterDifficulty(scope.row.difficulty) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="标签" prop="tags" show-overflow-tooltip>
            <template #default="scope">
              <el-tag class="mr-2" v-for="item in scope.row.tags" :key="item.id">{{ item.tag }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="提交数" prop="submitNum"></el-table-column>
          <el-table-column align="center" label="通过数" prop="acceptNum"></el-table-column>
          <el-table-column align="center" label="通过率" prop="acceptRate">
            <template #default="scope">
              {{ scope.row.acceptRate * 100 + '%' }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="创建时间" prop="createTime" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作">
            <template #default="scope">
              <el-button type="primary" link @click="handleDoQuestion(scope.row)">做题</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="p-2 absolute bottom-1 w-full">
          <el-pagination v-model:current-page="queryParams.current" v-model:page-size="queryParams.size" :page-sizes="[10, 20, 50]" :total="total" background layout="total, sizes, prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="float: right" />
        </div>
      </div>
      <div class="flex-shrink flex-grow w-1/3 min-w-24 may-card">
        <el-header class="may-title">
          <span>标签</span>
        </el-header>
        <main class="p-4">
          <el-check-tag class="mr-4 mb-4" type="success" :checked="isChecked(item.id)" v-for="item in tagList" :key="item.id" @change="handleChangeTag(item.id)">{{ item.tag }}</el-check-tag>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { onMounted, ref } from 'vue';
import { defHttp } from '@/utils/http/axios';
import { QuestionDifficulty } from '@/modules/oj/constant';

onMounted(() => {
  init();
});

const init = () => {
  getQuestionList();
  getTagList();
};

interface QueryParams {
  title?: string;
  difficulty?: number | null;
  selTag?: number | null;
  current: number;
  size: number;
}

type Tag = {
  id: number;
  tag: string;
  citationCount: number;
};

let queryParams = ref<QueryParams>({
  current: 1,
  size: 10,
});
let total = ref(0);

const tableData = ref([]);
const tagList = ref<Tag[]>([]);

const getQuestionList = () => {
  defHttp
    .get({
      url: '/oj/question/',
      params: {
        ...queryParams.value,
      },
    })
    .then((res) => {
      tableData.value = res.data.records;
      total.value = res.data.count;
    });
};

const getTagList = () => {
  defHttp
    .get({
      url: '/oj/tag/',
    })
    .then((res: any) => {
      tagList.value = res.data;
    });
};

const isChecked = (id: number) => {
  return queryParams.value.selTag === id;
};

/**
 * 查询题目列表
 */
const handleSearch = () => {
  getQuestionList();
};

const handleReset = () => {
  queryParams.value = {
    current: 1,
    size: 10,
  };
};

/**
 * 做题
 */
const handleDoQuestion = (row: any) => {
  router.push({
    path: `/oj/preview-question/${row.id}`,
  });
};

const handleChangeTag = (id: number) => {
  if (queryParams.value.selTag === id) {
    queryParams.value.selTag = null;
  } else {
    queryParams.value.selTag = id;
  }
  handleSearch();
};

const handleSizeChange = (size: number) => {
  queryParams.value.size = size;
  handleSearch();
};
const handleCurrentChange = (current: number) => {
  queryParams.value.current = current;
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
