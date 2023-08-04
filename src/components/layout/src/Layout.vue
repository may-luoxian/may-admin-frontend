<template>
  <el-container class="h-full">
    <el-aside width="auto">
      <Sidebar :isCollapse="isCollapse" />
    </el-aside>
    <el-container>
      <el-header class="p-0">
        <Navbar :isCollapse="isCollapse" />
      </el-header>
      <div class="bg-slate-50">
        <router-view></router-view>
      </div>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { Sidebar, Navbar } from '@/components/layout';
import { useMenuStore } from '@/stores/menu';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

let isCollapse = ref<boolean>(false);
const menuStore = useMenuStore();

let { fold } = storeToRefs(menuStore);
watch(fold, (val) => {
  isCollapse.value = val;
});
</script>

<style lang="scss" scoped>
.el-header {
  padding: 0;
  height: 80px;
}
</style>
