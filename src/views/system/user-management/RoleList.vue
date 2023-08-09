<template>
  <div>
    <div class="flex items-center justify-between font-semibold h-12 px-4">
      <div>
        <span class="mr-4">角色列表</span>
        <el-input placeholder="请输入角色名（enter查询）" style="width: 240px"></el-input>
      </div>
      <div>
        <el-button type="primary">新增角色</el-button>
        <el-button type="danger">批量删除</el-button>
      </div>
    </div>
    <el-table ref="roleTableRef" :data="roleList" :height="roleMaxHeight - 100" size="large" border stripe>
      <el-table-column type="selection" width="55" />
      <el-table-column label="角色名" prop="roleName" align="center" min-width="100"></el-table-column>
      <el-table-column label="是否禁用" prop="isDisable" align="center" min-width="80">
        <template #default="scope">
          <span>{{ filterIsDisable(scope.row.isDisable) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center" min-width="140"></el-table-column>
      <el-table-column label="操作" align="center" width="140">
        <template #default="scope">
          <div>
            <el-button type="primary" link>操作</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="primary" link>删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="float-right p-2">
      <el-pagination
        v-model:current-page="page.current"
        v-model:page-size="page.size"
        :page-sizes="[10, 20]"
        :total="total"
        background
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '@/api/api';
import { useDomControlsHook } from '@/hooks/domControls';
import { ref, onMounted, reactive, toRefs } from 'vue';

const roleTableRef = ref<any>();
const roleMaxHeight = useDomControlsHook(roleTableRef);

let rolesParams = reactive<any>({
  page: {
    current: 0,
    size: 10,
    keywords: '',
  },
});
let { page } = toRefs(rolesParams);
let roleData = reactive({
  roleList: [],
  total: 0,
});
let { roleList, total } = toRefs(roleData);

onMounted(() => {
  init();
});

const init = () => {
  getRoleList();
};

const getRoleList = () => {
  api.getRoles(rolesParams.page).then((res) => {
    roleData.roleList = res.data.records;
    roleData.total = res.data.count;
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

<style lang="scss" scoped></style>
