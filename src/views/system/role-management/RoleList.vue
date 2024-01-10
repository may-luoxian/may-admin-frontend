<template>
  <div>
    <div class="flex items-center justify-between font-semibold h-12 px-4">
      <div>
        <span class="mr-4">角色列表</span>
        <el-input placeholder="请输入角色名（enter查询）" style="width: 240px"></el-input>
      </div>
      <div>
        <el-button type="primary" @click="handleOpenRoleDialog">新增角色</el-button>
        <el-button type="danger" @click="handleDeleteRoles">删除角色</el-button>
      </div>
    </div>
    <el-table ref="roleTableRef" :data="roleList" :row-style="rowStyle" :height="roleMaxHeight - 100" size="large" border @row-click="handleRowClick">
      <el-table-column type="selection" width="55" />
      <el-table-column label="角色名" prop="roleName" align="center" min-width="100"></el-table-column>
      <el-table-column label="是否禁用" prop="isDisable" align="center" min-width="80">
        <template #default="scope">
          <span>{{ filterIsDisable(scope.row.isDisable) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center" min-width="140"></el-table-column>
      <el-table-column label="角色描述" prop="describe" align="center" min-width="360"></el-table-column>
    </el-table>
    <div class="float-right p-2">
      <el-pagination
        v-model:current-page="page.current"
        v-model:page-size="page.size"
        :page-sizes="[10, 20, 50]"
        :total="total"
        background
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <AddRoleDialog ref="addRoleDialogRef" />
  </div>
</template>

<script setup lang="ts">
import AddRoleDialog from '@/views/system/role-management/AddRoleDialog.vue';
import { defHttp } from '@/utils/http/axios';
import { useDomControlsHook } from '@/hooks/domControls';
import { ref, onMounted, reactive, toRefs } from 'vue';

const roleTableRef = ref<any>();
const roleMaxHeight = useDomControlsHook(roleTableRef);

const addRoleDialogRef = ref<any>();

const emit = defineEmits(['handleRowClick']);

let rolesParams = reactive<any>({
  page: {
    current: 1,
    size: 10,
    keywords: '',
  },
});
let { page } = toRefs(rolesParams);
let roleData = reactive({
  roleList: [],
  total: 0,
  selectedRowId: null,
});
let { roleList, total } = toRefs(roleData);

onMounted(() => {
  init();
});

const init = () => {
  getRoleList();
};

const getRoleList = () => {
  defHttp
    .get({
      url: '/admin/roles',
      params: rolesParams.page,
    })
    .then((res) => {
      roleData.roleList = res.data.records;
      roleData.total = res.data.count;
    });
};

const handleRowClick = (row: any) => {
  roleData.selectedRowId = row.id;
  emit('handleRowClick', row);
};
const rowStyle = ({ row }: any) => {
  if (row.id === roleData.selectedRowId) {
    return {
      'background-color': '#f4f4f4',
    };
  }
  return {};
};

const handleOpenRoleDialog = () => {
  addRoleDialogRef.value.open();
};

const handleDeleteRoles = () => {
  defHttp.delete({
    url: '/admin/roles',
    params: {
      
    }
  });
};

const handleSizeChange = () => {};
const handleCurrentChange = () => {};

const filterIsDisable = (isDisable: number) => {
  if (isDisable === 1) {
    return '是';
  }
  return '否';
};
</script>
