<template>
  <div class="w-full">
    <div class="flex justify-between items-center h-12 border-b border-solid dark:border-slate-600 px-4">
      <div class="flex items-center">
        <div class="cursor-pointer h-full flex items-center mr-4">
          <SvgIcon :name="isFold" size="22" @click="toggleMenu" />
        </div>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="item in breadcrumb" :key="item.path">{{ item.name }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="flex h-full">
        <div class="h-full flex mr-2 items-center">
          <AppThemeToggle />
        </div>
        <div class="h-full flex mr-2 items-center">
          <AppLocalPicker />
        </div>
        <div class="h-full flex items-center">
          <Controls />
        </div>
      </div>
    </div>
    <div class="flex items-center h-8 border-b dark:border-slate-600 border-solid">
      <div :class="isActive(tab)" class="flex items-center text-xs border-solid border-2 dark:border-slate-700 relative h-7 px-2 mx-1 leading-7 text-center cursor-pointer" v-for="tab in menuTab" :key="tab.path" @click="jumpTo(tab)">
        <span>{{ tab.name }}</span>
        <span class="pl-2" v-if="tab.path !== '/'">
          <SvgIcon class="close-icon hover:scale-125" name="close" size="10" @click.stop="removeMenuTab(tab)" />
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SvgIcon } from '@/components/icon';
import { useMenuStore, type MenuTab } from '@/stores/modules/menu';
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useRoute, useRouter, type RouteRecordNormalized } from 'vue-router';
import { AppLocalPicker } from '@/components/application';
import { Controls } from '@/components/layout/index';
import { AppThemeToggle } from '@/components/application';
import type { Breadcrumb } from '@/components/layout/index';
import { getPathByKey } from '@/utils';

const props = defineProps<{
  isCollapse: boolean;
}>();

const menuStore = useMenuStore();
const route = useRoute();
const router = useRouter();
const menuTab = ref<MenuTab[]>([]);
let breadcrumb = ref<Breadcrumb[]>([]);

onMounted(async () => {
  getMatched(route.matched);
  await nextTick();
  initMenuTab();
  saveTab(route.matched);
  getMenuTab();
});

watch(
  () => route.matched,
  async (newVal: any) => {
    getMatched(newVal);
    await nextTick();
    saveTab(newVal);
    getMenuTab();
  }
);

const initMenuTab = () => {
  menuStore.initMenuTab();
};

const getMatched = (currentMatched: RouteRecordNormalized[]) => {
  let menuList = menuStore.getMenuList;
  let matched: any = currentMatched.slice(-1);
  let footPath = getPathByKey(matched[0].name, menuList, 'name');
  footPath = footPath.map((item: any) => ({ name: item.name, path: item.path, meta: item.meta }));
  breadcrumb.value = footPath;
  let currentPath = breadcrumb.value[breadcrumb.value.length - 1].path;
  menuStore.setSelectedMenu(currentPath);
};
const saveTab = (currentRoutes: any) => {
  let currentRoute = currentRoutes.slice(-1)[0];
  let currentTab = {
    path: currentRoute.path,
    name: currentRoute.name,
  };
  menuStore.setMenuTab(currentTab);
};

const getMenuTab = () => {
  menuTab.value = menuStore.getMenuTab;
};

const toggleMenu = () => {
  menuStore.toggleMenu();
};

const removeMenuTab = (tab: MenuTab) => {
  menuStore.removeMenuTab(tab);
  router.push({ path: menuStore.getMenuTab[menuStore.getMenuTab.length - 1].path });
};

const isActive = (tab: MenuTab) => {
  if (route.fullPath === tab.path) {
    return 'is-active';
  }
  return '';
};

const jumpTo = (tab: MenuTab) => {
  router.push({ path: tab.path });
};

const isFold = computed(() => (props.isCollapse ? 'menu-expand' : 'menu-fold'));
</script>

<style lang="scss" scoped>
.is-active {
  background-color: #2a5eb7;
  color: white;
}
</style>
