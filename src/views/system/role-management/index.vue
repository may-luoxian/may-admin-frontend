<template>
  <el-header class="may-title"> 角色管理 </el-header>
  <div ref="draggedRef" class="may-container flex relative">
    <div class="w-3/5 h-full border-2 dark:border-slate-700 rounded border-solid">
      <RoleList @handleRowClick="handleRowClick" />
    </div>
    <div class="w-6 cursor-col-resize" @mousedown="mouseDown" @mouseup="mouseUp"></div>
    <div class="w-2/5 h-full border-2 dark:border-slate-700 rounded border-solid">
      <el-tabs ref="resourceTabsRef" v-model="listTab" class="overflow-auto" :style="{ height: resourceMaxHeight - 240 + 'px' }" type="border-card" @tab-change="handleTabChange">
        <el-tab-pane :name="LIST_TAB.MENU" label="菜单列表">
          <MenuList ref="menuListRef" />
        </el-tab-pane>
        <el-tab-pane :name="LIST_TAB.RESOURCE" label="资源列表">
          <ResourceList ref="resourceListRef" />
        </el-tab-pane>
      </el-tabs>
      <el-button class="my-2 float-right mr-2" type="primary" @click="handleSave">保存</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import RoleList from '@/views/system/role-management/RoleList.vue';
import MenuList from '@/views/system/role-management/MenuList.vue';
import ResourceList from '@/views/system/role-management/ResourceList.vue';
import { useDomControlsHook } from '@/hooks/domControls';
import { useDomDraggedHook } from '@/hooks/domDragged';
import { ref } from 'vue';
import { ElNotification } from 'element-plus';
import { defHttp } from '@/utils/http/axios';

enum LIST_TAB {
  MENU,
  RESOURCE,
}

const resourceTabsRef = ref<any>();
const draggedRef = ref<any>();
const resourceMaxHeight = useDomControlsHook(resourceTabsRef);
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

<style lang="scss" scope></style>
