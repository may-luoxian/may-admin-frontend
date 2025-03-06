<template>
  <div class="may-container">
    <div class="may-card min-container-h relative pb-14">
      <header class="may-title px-4">
        <span>提交记录</span>
        <div class="float-right h-full leading-10 flex items-center">
          <el-switch v-model="queryParams.isMine" inline-prompt active-text="我的" inactive-text="全部" @change="handleChangeSwitch" style="margin-right: 16px" />
          <el-input v-model="queryParams.title" placeholder="请输入题目名称" clearable style="width: 260px; margin-right: 16px" />
          <el-input v-model="queryParams.nickname" placeholder="请输入提交人" clearable style="width: 260px; margin-right: 16px" />
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </div>
      </header>
      <el-table ref="tableRef" :data="tableData" border stripe>
        <el-table-column align="center" label="题目名称" prop="title">
          <template #default="scope">
            <el-button link type="primary" @click="handleJumpToDoQuestion(scope.row.questionId)">{{ scope.row.title }}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="提交人" prop="nickname"></el-table-column>
        <el-table-column align="center" label="语言" prop="language"></el-table-column>
        <el-table-column align="center" label="判题状态" prop="status">
          <template #default="scope">
            <el-tag effect="dark" :type="filterStatusTag(scope.row.status)">{{ filterStatus(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="判题结果" prop="judgeInfo.message">
          <template #default="scope">
            <el-tag v-if="scope.row.judgeInfo.message" effect="dark" :type="filterResultTag(scope.row.judgeInfo.message)">{{ scope.row.judgeInfo.message }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="执行用时" prop="judgeInfo.time">
          <template #default="scope">
            {{ scope.row.judgeInfo.time ? scope.row.judgeInfo.time + 'ms' : '' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="消耗内存" prop="judgeInfo.memory">
          <template #default="scope">
            {{ scope.row.judgeInfo.memory ? (scope.row.judgeInfo.memory / 1024).toFixed(2) + 'MB' : '' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="查看详细信息">
          <template #default="scope">
            <el-button link type="primary" v-if="isShowCheck(scope.row)" @click="handleCheck(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="提交时间" prop="createTime"></el-table-column>
      </el-table>
      <div class="p-2 absolute bottom-1 w-full">
        <el-pagination v-model:current-page="queryParams.current" v-model:page-size="queryParams.size" :page-sizes="[10, 20, 50]" :total="total" background layout="total, sizes, prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="float: right" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { defHttp } from '@/utils/http/axios';
import { useUserStore } from '@/stores/modules/user';
import { QuestionSubStateEnum, JudgeInfoMsgEnum } from '@/modules/oj/constant';
import router from '@/router';

const userStore = useUserStore();

const queryParams = reactive({
  isMine: false,
  title: '',
  nickname: '',
  current: 1,
  size: 10,
});

const total = ref<number>(0);

const tableData = ref([]);

onMounted(() => {
  handleSearch();
});

const handleSearch = () => {
  let params = {};
  if (queryParams.isMine) {
    let { nickname } = userStore.getUserInfo;
    params = {
      ...queryParams,
      nickname,
    };
  } else {
    params = queryParams;
  }
  defHttp
    .get({
      url: '/oj/questionSubmit/',
      params,
    })
    .then((res: any) => {
      total.value = res.data.count;
      tableData.value = res.data.records;
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

const handleChangeSwitch = () => {
  handleSearch();
};

const handleJumpToDoQuestion = (id: number) => {
  router.push({
    path: `/oj/preview-question/${id}`,
  });
};

const handleCheck = (id: number) => {
  router.push({
    path: `/oj/question-submit-detail/${id}`,
  });
};

const isShowCheck = (row: any) => {
  return row.status === 2;
};

const filterStatus = (status: number) => {
  return QuestionSubStateEnum.find((item) => {
    return item.id === status;
  })?.message;
};

const filterStatusTag = (status: number) => {
  return QuestionSubStateEnum.find((item) => {
    return item.id === status;
  })?.type;
};

const filterResultTag = (result: string) => {
  if (result === '答案正确') {
    return 'success';
  } else if (result === '编译错误') {
    return 'warning';
  } else {
    return 'danger';
  }
};
</script>

<style lang="scss"></style>
