<template>
  <div class="h-full">
    <el-menu
      class="h-full w-52"
      router
      :collapse="props.isCollapse"
      background-color="#001529"
      text-color="#ffffffb3"
      active-text-color="#ffffff"
      :default-active="route.fullPath"
      unique-opened
      @select="handleSelectedMenu"
    >
      <MenuItem :menuTable="menuTable" :selectedMenu="selectedMenu" :isCollapse="props.isCollapse"> </MenuItem>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import MenuItem from '@/components/layout/src/MenuItem.vue';
import { ref } from 'vue';
import { useMenuStore } from '@/stores/menu';
import type { LayoutRoute } from '@/hooks/menu';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

const props = defineProps<{
  isCollapse: boolean;
}>();

const route = useRoute();
let menuTable = ref<LayoutRoute[]>([]);

const menuStore = useMenuStore();
let { userRoutes } = storeToRefs(menuStore);
menuTable.value = userRoutes.value;

/**
 * 选中菜单项
 */
let selectedMenu = ref(route.fullPath);
function handleSelectedMenu(index: string) {
  selectedMenu.value = index;
}
</script>

<style lang="scss" scoped></style>
