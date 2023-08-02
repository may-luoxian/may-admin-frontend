<template>
  <div class="w-full bg-white">
    <div class="flex items-center h-12 border-b border-gray-200 border-solid px-4">
      <div class="cursor-pointer h-full flex items-center mr-4">
        <SvgIcon :name="isFold" size="22" @click="toggleMenu" />
      </div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="item in breadcrumb">{{ item.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="flex items-center h-8 border-b border-gray-200 border-solid">
      <div
        :class="[isActive(tab), isFirstPage(tab)]"
        class="menu-tab relative h-7 pl-2 mx-1 leading-7 text-center cursor-pointer"
        v-for="tab in menuTab"
        :key="tab.path"
        @click="jumpTo(tab)"
      >
        {{ tab.name }}
        <SvgIcon
          class="close-icon absolute top-2 right-1 hover:scale-125"
          name="close"
          size="10"
          @click.stop="removeMenuTab(tab)"
          v-if="tab.path !== '/'"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SvgIcon } from '@/components/icon';
import { useMenuStore } from '@/stores/menu';
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate, type RouteRecordNormalized, type RouteLocationNormalized } from 'vue-router';
import type { Breadcrumb } from '@/components/layout/index';
import type { MenuTab } from '@/stores/menu';

const props = defineProps<{
  isCollapse: boolean;
}>();

const route = useRoute();
const router = useRouter();
let breadcrumb = ref<Breadcrumb[]>([]);
onMounted(() => {
  getMatched(route.matched);
  nextTick(() => {
    initMenuTab();
    saveTab(route);
    getMenuTab();
  });
});
onBeforeRouteUpdate((to) => {
  getMatched(to.matched);
  nextTick(() => {
    saveTab(to);
    getMenuTab();
  });
});
function initMenuTab() {
  const menuStore = useMenuStore();
  menuStore.initMenuTab();
}
function getMatched(currentMatched: RouteRecordNormalized[]) {
  let matched = currentMatched.map((item: RouteRecordNormalized) => {
    return {
      path: item.path,
      name: item.name,
      meta: item.meta,
    };
  });
  breadcrumb.value = matched.splice(1);
}
function saveTab(currentRoute: RouteLocationNormalized) {
  let currentTab = {
    path: currentRoute.fullPath,
    name: currentRoute.name,
  };
  const menuStore = useMenuStore();
  menuStore.setMenuTab(currentTab);
}

const menuTab = ref<MenuTab[]>([]);
function getMenuTab() {
  const menuStore = useMenuStore();
  menuTab.value = menuStore.getMenuTab;
}

const isFold = computed(() => (props.isCollapse ? 'menu-expand' : 'menu-fold'));

function toggleMenu() {
  const menuStore = useMenuStore();
  menuStore.toggleMenu();
}

function removeMenuTab(tab: MenuTab) {
  const menuStore = useMenuStore();
  menuStore.removeMenuTab(tab);
  router.push({ path: menuStore.getMenuTab[menuStore.getMenuTab.length - 1].path });
}

function isActive(tab: MenuTab) {
  if (route.fullPath === tab.path) {
    return 'is-active';
  }
  return '';
}

function isFirstPage(tab: MenuTab) {
  if (tab.path === '/') {
    return 'pr-2';
  }
  return 'pr-5';
}

function jumpTo(tab: MenuTab) {
  router.push({ path: tab.path });
}
</script>

<style lang="scss" scoped>
.menu-tab {
  font-size: 12px;
  border: 1px solid rgb(216, 216, 216);

  .close-icon {
    display: none;
  }

  &:hover {
    .close-icon {
      display: block;
    }
  }
}

.is-active {
  background-color: #2a5eb7;
  color: white;
}
</style>
