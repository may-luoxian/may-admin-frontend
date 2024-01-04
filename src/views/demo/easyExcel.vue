<template>
  <div class="easy-excel">
    <el-button type="primary" @click="handleExportModel">导出模板</el-button>
    <el-button type="primary" @click="handleExport">导出</el-button>
  </div>
</template>

<script setup lang="ts">
import api from '@/api/api';
import { MIME_MAP } from '@/enums/requestEnum';
import { downloadBlob } from '@/utils/download';
const handleExportModel = () => {
  api.exportModel().then((res: any) => {
    downloadBlob(res, MIME_MAP.xlsx);
  });
};
const handleExport = () => {
  api
    .mockDemo({
      pageNum: 2,
      pageSize: 10,
    })
    .then((res) => {
      console.log(res);
    });
};
</script>

<style lang="scss" scoped></style>
