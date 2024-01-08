<template>
  <el-header class="may-title">
    <span>用户管理</span>
    <div class="float-right h-full leading-10 flex items-center">
      <el-button type="primary" @click="handleSaveModel">创建用户</el-button>
    </div>
  </el-header>
  <el-main class="may-container">
    <el-table ref="tableRef" :data="userList" :height="tableMaxHeight - 40" size="large" border>
      <el-table-column label="昵称" align="center" prop="nickname" min-width="80"></el-table-column>
      <el-table-column label="头像" align="center" prop="avatar" min-width="120">
        <template #default="scope">
          <img class="w-28 mx-auto my-0" :src="scope.row.avatar" />
        </template>
      </el-table-column>
      <el-table-column label="登录方式" align="center" prop="loginType" min-width="120">
        <template #default="scope">
          <el-tag size="large">{{ filterLoginType(scope.row.loginType) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center" prop="roles" min-width="280">
        <template #default="scope">
          <el-tag class="mr-2" size="large" v-for="role in scope.row.roles" :key="role.id">{{ role.roleName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否禁用" align="center" prop="isDisable" min-width="80">
        <template #default="scope">
          {{ filterIsDisable(scope.row.isDisable) }}
        </template>
      </el-table-column>
      <el-table-column label="登录ip" align="center" prop="ipAddress" min-width="120"></el-table-column>
      <el-table-column label="登录地址" align="center" prop="ipSource" min-width="140"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" min-width="140"></el-table-column>
      <el-table-column label="上次登录时间" align="center" prop="lastLoginTime" min-width="140"></el-table-column>
      <el-table-column label="操作" align="center" min-width="120">
        <template #default="scope">
          <el-button type="primary" link @click="handleAllotRole(scope.row)">分配角色</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="primary" link @click="handleControl()">操作</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-main>

  <!-- 分配角色弹窗 -->
  <AllowRoleDialog ref="allowRoleRef" @init="init" />
</template>

<script setup lang="ts">
import { defHttp } from '@/utils/http/axios';
import { ref, onMounted, reactive, toRefs } from 'vue';
import { useDomControlsHook } from '@/hooks/domControls';
import AllowRoleDialog from '@/views/system/user-management/AllowRoleDialog.vue';

const tableRef = ref<any>();
const tableMaxHeight = useDomControlsHook(tableRef);
const allowRoleRef = ref<any>();

let tableData = reactive({
  userList: [],
});

let { userList } = toRefs(tableData);

onMounted(() => {
  init();
});

const init = () => {
  getUserList();
};

const getUserList = () => {
  defHttp
    .get({
      url: '/admin/users',
      params: {},
    })
    .then((res: any) => {
      tableData.userList = res.data;
    });
};

const handleControl = () => {};

const handleAllotRole = (row: any) => {
  allowRoleRef.value.open(row);
};

const handleSaveModel = () => {};

const filterLoginType = (loginType: number) => {
  if (loginType === 1) {
    return '邮箱';
  }
  return 'QQ';
};

const filterIsDisable = (isDisable: number) => {
  if (isDisable === 1) {
    return '是';
  }
  return '否';
};
</script>
