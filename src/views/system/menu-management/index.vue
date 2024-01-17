<template>
  <el-header class="may-title">
    <span>菜单管理</span>
    <div class="float-right h-full leading-10 flex items-center">
      <el-button type="primary" @click="saveRootMenu">新增顶级菜单</el-button>
    </div>
  </el-header>

  <el-main class="may-container">
    <el-table ref="tableRef" :data="tableData" :tree-props="{ children: 'children' }" :height="tableHeight - 40" row-key="id" size="large">
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
          <div>
            {{ filterIsHidden(scope.row.isHidden) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" min-width="140"></el-table-column>
      <el-table-column label="操作" align="center" min-width="140">
        <template #default="scope">
          <div>
            <el-button type="primary" text @click="handleMenuAdd(scope.row)" v-if="isShowMenuAdd(scope.row.menuType)">新增下级</el-button>
            <el-divider direction="vertical" v-if="isShowMenuAdd(scope.row.menuType)" />
            <el-button type="primary" text @click="handleMenuUpdate(scope.row)">修改</el-button>
            <el-divider direction="vertical" />
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              title="确定删除该菜单吗？"
              :width="180"
              @confirm="handleMenuDelete(scope.row)"
              @cancel="() => {}"
            >
              <template #reference>
                <el-button type="danger" text>删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-main>

  <!-- 新增、修改弹窗 -->
  <SaveUpdateDialog ref="saveUpdateDialogRef" :saveUpdateDialogTitle="saveUpdateDialogTitle" :saveUpdateDialogState="saveUpdateDialogState" @init="init" />
</template>

<script setup lang="ts">
import SaveUpdateDialog from '@/views/system/menu-management/SaveUpdateDialog.vue';
import { ref, onMounted } from 'vue';
import { useDomControlsHook } from '@/hooks/domControls';
import { MENU_TYPE, SAVEORUPDATE_DIALOG_STATE } from '@/enums/menuEnum';
import { defHttp } from '@/utils/http/axios';
import { treeToList } from '@/utils/index';
import { ElNotification } from 'element-plus';

const saveUpdateDialogRef = ref();
const tableRef = ref();
let tableData = ref([]);
let saveUpdateDialogTitle = ref('');
let saveUpdateDialogState = ref(SAVEORUPDATE_DIALOG_STATE.SAVE_ROOT);
let tableHeight = useDomControlsHook(tableRef) || 0;

onMounted(() => {
  init();
});
const init = () => {
  defHttp
    .get({
      url: '/admin/menus/menu',
    })
    .then((res) => {
      tableData.value = res.data;
    });
};
const saveRootMenu = () => {
  saveUpdateDialogTitle.value = '新增菜单';
  saveUpdateDialogState.value = SAVEORUPDATE_DIALOG_STATE.SAVE_ROOT;
  saveUpdateDialogRef.value.open();
};

const handleMenuAdd = (row: any) => {
  saveUpdateDialogTitle.value = '新增菜单';
  saveUpdateDialogState.value = SAVEORUPDATE_DIALOG_STATE.SAVE_CHILD;
  saveUpdateDialogRef.value.open(row);
};
const handleMenuUpdate = (row: any) => {
  saveUpdateDialogTitle.value = '修改菜单';
  saveUpdateDialogState.value = SAVEORUPDATE_DIALOG_STATE.UPDATE;
  saveUpdateDialogRef.value.open(row);
};
const handleMenuDelete = (row: any) => {
  const ids = treeToList([row]).map((item) => item.id);
  defHttp
    .delete({
      url: '/admin/menus/menu',
      data: ids,
    })
    .then((res) => {
      ElNotification({
        title: 'Success',
        type: 'success',
        message: res.message,
      });
      init();
    });
};

const isShowMenuAdd = (menuType: MENU_TYPE): boolean => {
  return menuType === MENU_TYPE.CATALOGUE;
};

const filterMenuType = (menuType: MENU_TYPE): string => {
  if (menuType === MENU_TYPE.MENU) {
    return '菜单';
  }
  return '目录';
};

const filterIsHidden = (isHidden: number): string => {
  if (isHidden) {
    return '隐藏';
  }
  return '显示';
};
</script>

<style lang="scss" scoped></style>
