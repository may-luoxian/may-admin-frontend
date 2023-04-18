<template>
  <div>
    <template v-for="item in menuTable" :key="item.id">
      <el-sub-menu v-if="item.children && item.children.length !== 0" :index="item.path">
        <template #title>
          <span>{{ item.name }}</span>
        </template>
        <MenuItem :menuTable="item.children" :selectedMenu="selectedMenu">
        </MenuItem>
      </el-sub-menu>
      <el-menu-item :class="isActiveMenu(item.path)" v-else :index="item.path">
        <template #title>
          <span slot="title">{{ item.name }}</span>
        </template>
      </el-menu-item>
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { LayoutRoute } from '@/hooks/menu';
const props = defineProps<{
  //菜单表
  menuTable: LayoutRoute
  //选中菜单项
  selectedMenu: string
}>()
/**
 * 当前激活菜单
 */
function isActiveMenu(path: string) {
  if (path === props.selectedMenu) {
    return 'active-bg-menu'
  }
  return ''
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
