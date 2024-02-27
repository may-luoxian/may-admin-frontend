<template>
  <div>
    <div class="flex items-center justify-between font-semibold h-12 px-4">
      <div>
        <span class="mr-4">角色列表</span>
        <el-input v-model="page.keywords" placeholder="请输入角色名（enter查询）" style="width: 240px" @keyup.enter="getRoleList"></el-input>
      </div>
      <div>
        <el-button type="primary" @click="handleOpenRoleDialog('ADD', null)">新增角色</el-button>
        <el-button type="danger" @click="handleDeleteRoles">删除角色</el-button>
      </div>
    </div>
    <el-table ref="roleTableRef" :data="roleList" :row-class-name="rowClassName" :height="roleMaxHeight - 240" size="large" border @row-click="handleRowClick" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="角色名" prop="roleName" align="center" min-width="100"></el-table-column>
      <el-table-column label="是否禁用" prop="isDisable" align="center" min-width="80">
        <template #default="scope">
          <span>{{ filterIsDisable(scope.row.isDisable) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center" min-width="140"></el-table-column>
      <el-table-column label="角色描述" prop="describe" align="center" min-width="360"></el-table-column>
      <el-table-column label="操作" prop="describe" align="center" min-width="60">
        <template #default="scope">
          <el-button type="primary" text @click.prevent="handleOpenRoleDialog('EDIT', scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="float-right p-2">
      <el-pagination v-model:current-page="page.current" v-model:page-size="page.size" :page-sizes="[10, 20, 50]" :total="total" background layout="total, sizes, prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <AddRoleDialog ref="addRoleDialogRef" @init="init" />
  </div>
</template>

<script setup lang="ts">
import AddRoleDialog from '@/modules/system/role-management/AddRoleDialog.vue';
import { defHttp } from '@/utils/http/axios';
import { useDomControlsHook } from '@/hooks/domControls';
import { ref, onMounted, reactive, toRefs, unref } from 'vue';
import { ElNotification, ElMessageBox } from 'element-plus';

const roleTableRef = ref<any>();
const roleMaxHeight = useDomControlsHook(roleTableRef);
const addRoleDialogRef = ref<any>();
let selectedIds = ref([]);
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
  reset();
  getRoleList();
};

const reset = () => {
  rolesParams.page = {
    current: 1,
    size: 10,
    keywords: '',
  };
};

const getRoleList = () => {
  defHttp
    .get({
      url: '/admin/role/roles',
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
const rowClassName = ({ row }: any) => {
  if (row.id === roleData.selectedRowId) {
    return 'row-click-style';
  }
  return {};
};

const handleOpenRoleDialog = (status: string, row: any) => {
  addRoleDialogRef.value.open(status, row);
};

const handleDeleteRoles = () => {
  ElMessageBox.confirm('确定删除该角色？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
    .then(() => {
      defHttp
        .delete({
          url: '/admin/role/roles',
          data: {
            ids: unref(selectedIds),
          },
        })
        .then((res) => {
          ElNotification({
            title: 'success',
            type: 'success',
            message: res.message,
          });
          init();
        });
    })
    .catch(() => {});
};

const handleSizeChange = (size: number) => {
  page.value.size = size;
  getRoleList();
};
const handleCurrentChange = (current: number) => {
  page.value.current = current;
  getRoleList();
};

const handleSelectionChange = (selection: any) => {
  selectedIds.value = selection.map((item: any) => item.id);
};

const filterIsDisable = (isDisable: number) => {
  if (isDisable === 1) {
    return '是';
  }
  return '否';
};
</script>
<style lang="scss">
.el-table {
  .row-click-style {
    @apply bg-slate-100 dark:bg-slate-800;
  }
}
</style>
