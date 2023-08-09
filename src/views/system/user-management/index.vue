<template>
  <el-header class="may-title"> 角色管理 </el-header>
  <div ref="draggedRef" class="may-container p-4 flex">
    <div class="w-1/2 h-full border-slate-200 border-2 rounded border-solid">
      <RoleList />
    </div>
    <div class="w-6 cursor-col-resize" @mousedown="mouseDown" @mouseup="mouseUp"></div>
    <div class="w-1/2 h-full border-slate-200 border-2 rounded border-solid">
      <el-tabs ref="resourceTabsRef" type="border-card" :style="{ height: resourceMaxHeight - 54 + 'px' }">
        <el-tab-pane label="菜单列表">
          <MenuList />
        </el-tab-pane>
        <el-tab-pane label="资源列表">
          <ResourceList />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import RoleList from '@/views/system/user-management/RoleList.vue';
import MenuList from '@/views/system/user-management/MenuList.vue';
import ResourceList from '@/views/system/user-management/ResourceList.vue';
import { useDomControlsHook } from '@/hooks/domControls';
import { useDomDraggedHook } from '@/hooks/domDragged';
import { ref } from 'vue';

const resourceTabsRef = ref<any>();
const draggedRef = ref<any>();
const resourceMaxHeight = useDomControlsHook(resourceTabsRef);

const { mouseDown, mouseUp } = useDomDraggedHook(draggedRef);
</script>

<style lang="scss" scope></style>
