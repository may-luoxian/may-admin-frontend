<template>
  <div>
    <el-header class="may-title"> 角色管理 </el-header>
    <div ref="draggedRef" class="may-container flex relative">
      <div ref="leftRef" class="w-3/5 border-2 border-slate-300 dark:border-slate-700 rounded border-solid overflow-auto" :style="{ height: leftHeight - 200 + 'px' }">
        <RoleList @handleRowClick="handleRowClick" />
      </div>
      <div class="w-6 cursor-col-resize" @mousedown="mouseDown" @mouseup="mouseUp"></div>
      <div ref="rightRef" class="w-2/5 border-2 border-slate-300 dark:border-slate-700 rounded border-solid overflow-auto" :style="{ height: rightHeight - 200 + 'px' }">
        <el-tabs v-model="listTab" class="overflow-auto" type="border-card" @tab-change="handleTabChange">
          <el-tab-pane :name="LIST_TAB.MENU" label="菜单列表">
            <MenuList ref="menuListRef" />
          </el-tab-pane>
          <el-tab-pane :name="LIST_TAB.RESOURCE" label="资源列表">
            <ResourceList ref="resourceListRef" />
          </el-tab-pane>
        </el-tabs>
        <div class="fix">
          <el-button class="my-2 float-right mr-2" type="primary" @click="handleSave">保存</el-button>
        </div>
        <el-divider style="margin: 0"></el-divider>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RoleList from '@/modules/system/role-management/RoleList.vue';
import MenuList from '@/modules/system/role-management/MenuList.vue';
import ResourceList from '@/modules/system/role-management/ResourceList.vue';
import { useDomDraggedHook } from '@/hooks/domDragged';
import { ref } from 'vue';
import { ElNotification } from 'element-plus';
import { defHttp } from '@/utils/http/axios';
import { useDomControlsHook } from '@/hooks/domControls';

enum LIST_TAB {
  MENU,
  RESOURCE,
}

const leftRef = ref();
const leftHeight = useDomControlsHook(leftRef);
const rightRef = ref();
const rightHeight = useDomControlsHook(leftRef);

const draggedRef = ref<any>();
const menuListRef = ref<any>();
const resourceListRef = ref<any>();
let listTab = ref<number>(LIST_TAB.MENU);
let roleId = ref<number>();
const { mouseDown, mouseUp } = useDomDraggedHook(draggedRef);

const handleRowClick = (row: any) => {
  let { id, menuIds, resourceIds } = row;
  roleId.value = id;
  menuListRef.value.handleSetChecked(menuIds);
  resourceListRef.value.handleSetChecked(resourceIds);
};

const handleTabChange = (tab: number) => {
  listTab.value = tab;
};

const handleSave = async () => {
  if (!roleId.value) {
    ElNotification({
      title: 'Error',
      message: '未选择角色',
      type: 'error',
    });
    return;
  }
  try {
    let params: any = { id: roleId.value };
    let res: any = {};
    if (listTab.value === LIST_TAB.MENU) {
      let ids = menuListRef.value.getCheckedKeys();
      params.roleMenuIds = ids;
      res = await defHttp.post({
        url: '/admin/role/menus',
        params,
      });
    } else if (listTab.value === LIST_TAB.RESOURCE) {
      let ids = resourceListRef.value.getCheckedKeys();
      params.roleResourceIds = ids;
      res = await defHttp.post({
        url: '/admin/role/resources',
        params,
      });
    }
    ElNotification({
      title: 'success',
      message: res.message,
      type: 'success',
    });
  } catch (error) {
    console.error(error);
  }
};
</script>
