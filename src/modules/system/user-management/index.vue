<template>
  <div>
    <el-header class="may-title">
      <span>用户管理</span>
      <div class="float-right h-full leading-10 flex items-center">
        <el-form :model="form" inline>
          <el-form-item class="query-page">
            <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item class="query-page">
            <el-input v-model="form.nickname" placeholder="请输入昵称"></el-input>
          </el-form-item>
          <el-form-item class="query-page">
            <el-select v-model="form.loginType" placeholder="请选择登录方式" style="width: 230px"></el-select>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button type="primary" @click="handleSaveModel">创建用户</el-button>
      </div>
    </el-header>
    <el-main class="may-container">
      <el-table :data="userList" size="large" border>
        <el-table-column label="用户名" align="center" prop="username" min-width="120"></el-table-column>
        <el-table-column label="昵称" align="center" prop="nickname" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="头像" align="center" prop="avatar" min-width="120">
          <template #default="scope">
            <img class="w-20 mx-auto my-0 object-cover" :src="avatar(scope.row.avatar)" />
          </template>
        </el-table-column>
        <el-table-column label="登录方式" align="center" prop="loginType" min-width="120">
          <template #default="scope">
            <el-tag size="large">{{ filterLoginType(scope.row.loginType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="角色" align="center" prop="roles" min-width="180">
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
        <el-table-column label="操作" align="center" min-width="160">
          <template #default="scope">
            <el-button type="primary" link @click="handleAllotRole(scope.row)">分配角色</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="primary" link @click="handlePreviewHome(scope.row)">预览门户</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" title="确定删除该用户吗？" :width="180" @confirm="handleDelete(scope.row.id)" @cancel="() => {}">
              <template #reference>
                <el-button type="danger" link>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="float-right p-2">
        <el-pagination v-model:current-page="form.current" v-model:page-size="form.size" :page-sizes="[10, 20, 50]" :total="total" background layout="total, sizes, prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-main>

    <!-- 分配角色弹窗 -->
    <AllowRoleDialog ref="allowRoleRef" @init="init" />

    <!-- 创建修改角色弹窗 -->
    <SaveUpdateDialog ref="saveUpdateRef" @init="init" />
  </div>
</template>

<script setup lang="ts">
import { defHttp } from '@/utils/http/axios';
import { ref, onMounted, reactive, toRefs } from 'vue';
import { useHomeStore } from '@/stores/modules/home';
import { ElNotification } from 'element-plus';
import AllowRoleDialog from './AllowRoleDialog.vue';
import SaveUpdateDialog from './SaveUpdateDialog.vue';
import router from '@/router';

const allowRoleRef = ref();
const saveUpdateRef = ref();

interface Form {
  username?: string;
  nickname?: string;
  loginType?: number;
  current?: number;
  size?: number;
}

const form = reactive<Form>({});

const total = ref<number>(0);

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
      url: '/admin/users/list',
      params: form,
    })
    .then((res: any) => {
      tableData.userList = res.data.records;
      total.value = res.data.count;
    });
};

const handleAllotRole = (row: any) => {
  allowRoleRef.value.open(row);
};

const handlePreviewHome = (row: any) => {
  let userInfo = { userInfoId: row.userInfoId, username: row.username };
  useHomeStore().setPreviewUser(userInfo);
  router.push('/system/home-management');
};

const handleSaveModel = () => {
  saveUpdateRef.value.open();
};

const handleQuery = () => {
  getUserList();
};

const handleSizeChange = (size: number) => {
  form.size = size;
  getUserList();
};
const handleCurrentChange = (current: number) => {
  form.current = current;
  getUserList();
};

const handleDelete = (id: number) => {
  defHttp
    .delete({
      url: '/admin/users/user',
      data: {
        id,
      },
    })
    .then((res) => {
      ElNotification({
        title: 'success',
        message: res.message,
        type: 'success',
      });
      getUserList();
    });
};

const avatar = (avatar: any) => {
  return avatar || '../src/assets/images/default-avatar.jpg';
};

const filterLoginType = (loginType: number) => {
  if (loginType === 1) {
    return '邮箱';
  } else if (loginType === 2) {
    return 'QQ';
  } else {
    return '后台创建';
  }
};

const filterIsDisable = (isDisable: number) => {
  if (isDisable === 1) {
    return '是';
  }
  return '否';
};
</script>

<style lang="scss" scoped>
:deep(.el-form-item.query-page) {
  margin-bottom: 0;
}
</style>
