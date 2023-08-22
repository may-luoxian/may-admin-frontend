<template>
  <el-header class="may-title">
    <span>接口管理</span>
    <div class="float-right h-full leading-10 flex items-center">
      <el-button type="primary" @click="handleSaveModel">新增模块</el-button>
    </div>
  </el-header>
  <div class="may-container">
    <el-table ref="tableRef" :data="tableData" :tree-props="{ children: 'children' }" :height="tableMaxHeight - 20" row-key="id" size="large">
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
          <el-button type="primary" link v-if="isModel(scope.row.isModel)" @click="handleSaveResource(scope.row)">新增下级</el-button>
          <el-divider direction="vertical" v-if="isModel(scope.row.isModel)"></el-divider>
          <el-button type="primary" link @click="handleUpdateResource(scope.row)">修改</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="danger" link>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 新增、修改弹窗 -->
  <SaveUpdateDialog ref="SavaUpdateRef" :status="status" :selectedRow="selectedRow" />
</template>

<script setup lang="ts">
import api from '@/api/api';
import SaveUpdateDialog from '@/views/system/resource-management/SaveUpdateDialog.vue';
import type { RequestMethod } from '@/api/types';
import { SAVEORUPDATE_DIALOG_STATE } from '@/enums/menuEnum';
import { REQUEST_METHOD } from '@/enums/requestEnum';
import { ref, onMounted, reactive, toRefs, nextTick } from 'vue';
import { useDomControlsHook } from '@/hooks/domControls';

const tableRef = ref<any>();
const tableMaxHeight = useDomControlsHook(tableRef);
let resourceData = reactive<any>({
  tableData: [],
  selectedRow: {},
});
let status = ref<number>(0);
let { tableData, selectedRow } = toRefs(resourceData);
const SavaUpdateRef = ref<any>();

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

const handleSaveModel = async () => {
  status.value = SAVEORUPDATE_DIALOG_STATE.SAVE_ROOT;
  await nextTick();
  SavaUpdateRef.value.open();
};
const handleSaveResource = async (row: any) => {
  status.value = SAVEORUPDATE_DIALOG_STATE.SAVE_CHILD;
  resourceData.selectedRow = row;
  await nextTick();
  SavaUpdateRef.value.open();
};
const handleUpdateResource = async (row: any) => {
  status.value = SAVEORUPDATE_DIALOG_STATE.UPDATE;
  resourceData.selectedRow = row;
  await nextTick();
  SavaUpdateRef.value.open();
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

const isModel = (isModel: number) => {
  return isModel === 1;
};
</script>

<style lang="scss" scoped></style>
