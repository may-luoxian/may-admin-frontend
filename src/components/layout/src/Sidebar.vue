<template>
  <div class="h-full side-bar">
    <el-menu class="h-full w-52" router :collapse="props.isCollapse" :default-active="route.fullPath" unique-opened @select="handleSelectedMenu">
      <MenuItem :menuTable="menuTable" :selectedMenu="getSelectedMenu" :isCollapse="props.isCollapse"> </MenuItem>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import MenuItem from '@/components/layout/src/MenuItem.vue';
import { ref } from 'vue';
import { useMenuStore } from '@/stores/modules/menu';
import type { LayoutRoute } from '@/hooks/menu';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

const props = defineProps<{
  isCollapse: boolean;
}>();

const route = useRoute();
let menuTable = ref<LayoutRoute[]>([]);
const menuStore = useMenuStore();
let { getSelectedMenu } = storeToRefs(menuStore);
menuTable.value = menuStore.getMenuList;

/**
 * 选中菜单项
 */
const handleSelectedMenu = (index: string) => {
  menuStore.setSelectedMenu(index);
};
</script>

<style lang="scss" scoped>
.side-bar {
  --el-menu-active-color: var(--side-bar-active-color) !important;
  --el-menu-text-color: var(--side-bar-text-color) !important;
  :deep(.active-bg-menu) {
    background-color: var(--side-bar-active-bg) !important;
  }
  :deep(.el-menu-item) {
    border-radius: 8px !important;
  }
  :deep(.el-menu-item:hover) {
    color: var(--side-bar-text-color) !important;
  }
  :deep(.el-sub-menu__title:hover, .el-sub-menu__title:focus) {
    color: var(--side-bar-text-color) !important;
  }
}
</style>
