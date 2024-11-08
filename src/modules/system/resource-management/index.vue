<template>
  <div>
    <el-header class="may-title">
      <span>接口管理</span>
      <div class="float-right h-full leading-10 flex items-center">
        <el-input v-model="queryParams.resourceName" placeholder="请输入资源名称" style="width: 260px; margin-right: 16px" />
        <el-select v-model="queryParams.requestMethod" placeholder="请选择请求类型" clearable style="width: 260px; margin-right: 16px">
          <el-option v-for="item in REQUEST_METHODS_CONSTANT" :key="item.id" :value="item.method" :label="item.method" />
        </el-select>
        <el-select v-model="queryParams.isAnonymous" placeholder="请选择是否匿名" clearable style="width: 260px; margin-right: 16px">
          <el-option v-for="item in IS_ANONYMOUS_CONSTANT" :key="item.id" :value="item.id" :label="item.label"></el-option>
        </el-select>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button type="primary" @click="handleSaveModel">新增模块</el-button>
      </div>
    </el-header>
    <div class="may-container fix">
      <el-table ref="tableRef" border :data="tableData" :tree-props="{ children: 'children' }" row-key="id" size="large">
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
            <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" title="确定删除该资源吗？" :width="180" @confirm="handleDeleteResource(scope.row)" @cancel="() => {}">
              <template #reference>
                <el-button type="danger" link>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增、修改弹窗 -->
    <SaveUpdateDialog ref="SavaUpdateRef" :status="status" :selectedRow="selectedRow" @init="init" />
  </div>
</template>

<script setup lang="ts">
import SaveUpdateDialog from '@/modules/system/resource-management/SaveUpdateDialog.vue';
import type { RequestMethod } from '@/api/types';
import { SAVEORUPDATE_DIALOG_STATE } from '@/enums/menuEnum';
import { REQUEST_METHOD_ENUM } from '@/enums/requestEnum';
import { IS_ANONYMOUS } from '@/enums/commonEnum';
import { REQUEST_METHODS_CONSTANT, IS_ANONYMOUS_CONSTANT } from '@/modules/system/constant';
import { ref, onMounted, reactive, toRefs, nextTick } from 'vue';
import { defHttp } from '@/utils/http/axios';
import { treeToList } from '@/utils';
import { ElNotification } from 'element-plus';

let resourceData = reactive<any>({
  tableData: [],
  selectedRow: {},
  total: 0,
});
let condition = reactive<any>({
  queryParams: {
    resourceName: '',
    requestMethod: '',
    isAnonymous: null,
  },
});

let status = ref<number>(0);
let { tableData, selectedRow } = toRefs(resourceData);
let { queryParams } = toRefs(condition);
const SavaUpdateRef = ref<any>();

onMounted(() => {
  init();
});

const init = () => {
  getResourceList();
};

const getResourceList = () => {
  defHttp
    .get({
      url: '/management-center/admin/resource/resources',
      params: condition.queryParams,
    })
    .then((res: any) => {
      resourceData.tableData = res.data;
    });
};

const handleSearch = () => {
  getResourceList();
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
const handleDeleteResource = (row: any) => {
  const ids = treeToList([row]).map((item) => item.id);
  defHttp
    .delete({
      url: '/management-center/admin/resource/resources',
      data: ids,
    })
    .then((res) => {
      ElNotification({
        title: 'Success',
        type: 'success',
        message: res.message,
      });
      getResourceList();
    });
};

const filterRequestMethod = (requestMethod: RequestMethod) => {
  if (requestMethod === REQUEST_METHOD_ENUM.GET) {
    return 'info';
  } else if (requestMethod === REQUEST_METHOD_ENUM.POST) {
    return 'success';
  } else if (requestMethod === REQUEST_METHOD_ENUM.PUT) {
    return 'warning';
  } else if (requestMethod === REQUEST_METHOD_ENUM.DELETE) {
    return 'danger';
  } else {
    return 'info';
  }
};

const filterIsAnonymous = (isAnonymous: number) => {
  if (isAnonymous === IS_ANONYMOUS.TRUE) {
    return '是';
  }
  return '否';
};

const isModel = (isModel: number) => {
  return isModel === 1;
};
</script>

<style lang="scss" scoped></style>
