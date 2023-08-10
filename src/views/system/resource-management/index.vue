<template>
  <el-header class="may-title"> 接口管理 </el-header>
  <div class="may-container">
    <el-table ref="tableRef" :data="tableData" :tree-props="{ children: 'children' }" :height="tableMaxHeight - 20" row-key="id" size="large">
      <el-table-column type="index" width="80" label="序号" align="center"></el-table-column>
      <el-table-column label="资源名称" align="center" prop="resourceName" min-width="120"></el-table-column>
      <el-table-column label="请求类型" align="center" min-width="120">
        <template #default="scope">
          <el-tag :type="filterRequestMethod(scope.row.requestMethod)">{{ scope.row.requestMethod || '模块' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="请求路径" align="center" prop="url" min-width="180"></el-table-column>
      <el-table-column label="匿名" align="center" prop="isAnonymous" min-width="80">
        <template #default="scope">
          <span>{{ filterIsAnonymous(scope.row.isAnonymous) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" min-width="120"></el-table-column>
      <el-table-column label="操作" align="center" min-width="120">
        <template #default="scope">
          <el-button></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import api from '@/api/api';
import type { RequestMethod } from '@/api/types';
import { REQUEST_METHOD } from '@/enums/requestEnum';
import { ref, onMounted, reactive, toRefs } from 'vue';
import { useDomControlsHook } from '@/hooks/domControls';

const tableRef = ref<any>();
const tableMaxHeight = useDomControlsHook(tableRef);
let resourceData = reactive<any>({
  tableData: [],
});
let { tableData } = toRefs(resourceData);

onMounted(() => {
  init();
});

const init = () => {
  getResourceList();
};

const getResourceList = () => {
  api.getResources().then((res) => {
    resourceData.tableData = res.data;
  });
};

const filterRequestMethod = (requestMethod: RequestMethod) => {
  if (requestMethod === REQUEST_METHOD.GET) {
    return '';
  } else if (requestMethod === REQUEST_METHOD.POST) {
    return 'success';
  } else if (requestMethod === REQUEST_METHOD.PUT) {
    return 'warning';
  } else if (requestMethod === REQUEST_METHOD.DELETE) {
    return 'danger';
  } else {
    return 'info';
  }
};

const filterIsAnonymous = (isAnonymous: number) => {
  if (isAnonymous) {
    return '是';
  }
  return '否';
};
</script>

<style lang="scss" scoped></style>
