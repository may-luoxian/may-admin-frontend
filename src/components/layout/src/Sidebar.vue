<template>
  <div class="h-full">
    <el-menu class="h-full w-52" router background-color="#001529" text-color="#ffffffb3" active-text-color="#ffffff"
      default-active="/" unique-opened @select="handleSelectedMenu">
      <MenuItem :menuTable="menuTable" :selectedMenu="selectedMenu">
      </MenuItem>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import MenuItem from '@/components/layout/src/MenuItem.vue'
import { ref } from 'vue';
import { useMenuStore } from '@/stores/menu';

const menuStore = useMenuStore();
let menuTable = menuStore.getMenuTable;

let selectedMenu = ref('/')
/**
 * 选中菜单项
 */
function handleSelectedMenu(index: string) {
  selectedMenu.value = index
}

</script>

<style lang="scss" scoped></style>
