<template>
  <div class="easy-excel">
    <el-button type="primary" @click="handleExportModel">导出模板</el-button>
    <el-button type="primary" @click="handleExport">导出</el-button>

    <el-table :data="tableData" border>
      <el-table-column prop="test1" align="center" label="测试1"></el-table-column>
      <el-table-column prop="test2" align="center" label="测试2"></el-table-column>
      <el-table-column prop="test3" align="center" label="测试3">
        <template #default="scope">
          <div>
            <!-- {{ filterComputed(scope.row.test3) }} -->
            {{ filterMethod(scope.row.test3) }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { MIME_MAP } from '@/enums/requestEnum';
import { downloadBlob } from '@/utils/download';
import { defHttp } from '@/utils/http/axios';
import { reactive, toRefs, computed } from 'vue';

const handleExportModel = () => {
  defHttp
    .get({
      url: '/excel/exportModel',
    })
    .then((res: any) => {
      downloadBlob(res, MIME_MAP.xlsx);
    });
};
const handleExport = () => {
  defHttp
    .get({
      url: '/admin/menu',
      params: {
        pageNum: 1,
        pageSize: 10,
      },
    })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    });
};

const data = reactive({
  tableData: [
    {
      test1: 123,
      test2: 456,
      test3: 789,
    },
    {
      test1: 1,
      test2: 2,
      test3: 3,
    },
    {
      test1: 4,
      test2: 5,
      test3: 6,
    },
  ],
  jiananfei: 10,
});

const { tableData, jiananfei } = toRefs(data);

// 方法1
const filterComputed = computed(() => {
  return (test3: number) => {
    return test3 + jiananfei.value;
  };
});

// 方法2
const filterMethod = (test3: number) => {
  return test3 + jiananfei.value;
};
</script>

<style lang="scss" scoped></style>
