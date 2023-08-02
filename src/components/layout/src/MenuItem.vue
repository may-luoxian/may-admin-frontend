<template>
  <div>
    <template v-for="item in menuTable" :key="item.id">
      <el-sub-menu v-if="item.children && item.children.length !== 0" :index="item.path">
        <template #title>
          <i :class="item.icon" class="mr-2"></i>
          <span v-if="!props.isCollapse">{{ item.name }}</span>
        </template>
        <MenuItem :menuTable="item.children" :selectedMenu="selectedMenu" :isCollapse="false"> </MenuItem>
      </el-sub-menu>
      <el-menu-item :class="isActiveMenu(item.path)" v-else :index="item.path">
        <i :class="item.icon" class="mr-2"></i>
        <template #title>
          <span>{{ item.name }}</span>
        </template>
      </el-menu-item>
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { LayoutRoute } from '@/hooks/menu';
import { toRef } from 'vue';
const props = withDefaults(
  defineProps<{
    //菜单表
    menuTable: Array<LayoutRoute>;
    //选中菜单项
    selectedMenu: string;
    // 菜单收放（只有最上层需要处理）
    isCollapse: boolean;
  }>(),
  {
    isCollapse: false,
  }
);
let menuTable = toRef(props, 'menuTable');
/**
 * 当前激活菜单
 */
function isActiveMenu(path: string) {
  if (path === props.selectedMenu) {
    return 'active-bg-menu';
  }
  return '';
}
</script>

<style lang="scss" scoped>
.active-bg-menu {
  background-color: #0960bd;
}

:deep(.el-sub-menu__title) {
  &:hover {
    color: white !important;
  }
}

:deep(.el-menu-item) {
  &:hover {
    color: white !important;
  }
}
</style>
