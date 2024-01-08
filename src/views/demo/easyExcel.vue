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
import { defHttp } from '@/utils/http/axios';

const handleExportModel = () => {
  api.exportModel().then((res: any) => {
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
</script>

<style lang="scss" scoped></style>
