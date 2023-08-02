<template>
  <div class="may-container">
    <el-header>
      <div class="may-title">菜单管理</div>
    </el-header>
    <el-main>
      <el-table :data="tableData" :tree-props="{ children: 'children' }" row-key="id" size="large">
        <el-table-column label="菜单名称" align="center" prop="name" min-width="80"></el-table-column>
        <el-table-column label="图标" align="center" prop="icon" min-width="120">
          <template #default="scope">
            <i :class="'iconfont ' + scope.row.icon"></i>
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center" prop="orderNum" min-width="80"></el-table-column>
        <el-table-column label="菜单类型" align="center" prop="menuType" min-width="80">
          <template #default="scope">
            <div>
              {{ filterMenuType(scope.row.menuType) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="访问路径" align="center" prop="path" min-width="140"></el-table-column>
        <el-table-column label="组件路径" align="center" prop="component" min-width="140"></el-table-column>
        <el-table-column label="隐藏" align="center" prop="isHidden" min-width="80">
          <template #default="scope">
            <div></div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" min-width="140"></el-table-column>
        <el-table-column label="操作" align="center" min-width="140">
          <template #default="scope">
            <div>
              <el-button type="primary" text @click="handleMenuAdd(scope.row)" v-if="isShowMenuAdd(scope.row.menuType)">新增下级</el-button>
              <el-divider direction="vertical" v-if="isShowMenuAdd(scope.row.menuType)" />
              <el-button type="primary" text @click="handleMenuUpdate(scope.row.menuType)">修改</el-button>
              <el-divider direction="vertical" />
              <el-button type="primary" text @click="handleMenuDelete">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <!-- 新增、修改弹窗 -->
    <SaveUpdateDialog ref="saveUpdateDialogRef" :selectedData="selectedData" />
  </div>
</template>

<script setup lang="ts">
import api from '@/api/api';
import SaveUpdateDialog from '@/views/system/menuManagement/SaveUpdateDialog.vue';
import { MENU_TYPE } from '@/enums/menuEnum';
import { ref, reactive, onMounted } from 'vue';

onMounted(() => {
  init();
});

let tableData = ref([]);
let selectedData = reactive({});
let saveUpdateDialogTitle = ref<string>('');
const saveUpdateDialogRef = ref<any>(null);

const init = function () {
  api.getMenus().then((res) => {
    tableData.value = res.data;
  });
};

const handleMenuAdd = (row: any) => {
  selectedData = row;
  saveUpdateDialogTitle.value = '新增菜单';
  saveUpdateDialogRef.value.open();
};
const handleMenuUpdate = (row: any) => {
  selectedData = row;
  saveUpdateDialogTitle.value = '修改菜单';
  saveUpdateDialogRef.value.open();
};
const handleMenuDelete = () => {};

const isShowMenuAdd = (menuType: MENU_TYPE): boolean => {
  return menuType === MENU_TYPE.CATALOGUE;
};

const filterMenuType = (menuType: MENU_TYPE): string => {
  if (menuType === MENU_TYPE.MENU) {
    return '菜单';
  }
  return '目录';
};
</script>

<style lang="scss" scoped></style>
