<template>
  <el-container class="h-full">
    <el-aside width="auto">
      <Sidebar :isCollapse="isCollapse" />
    </el-aside>
    <el-container>
      <el-header class="p-0">
        <Navbar :isCollapse="isCollapse" />
      </el-header>
      <div ref="layoutContentRef" class="layout-content overflow-auto" :style="{ height: maxHeight + 'px' }">
        <router-view v-slot="{ Component }">
          <transition name="fade-slide">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { Sidebar, Navbar } from '@/components/layout';
import { useMenuStore } from '@/stores/modules/menu';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useDomControlsHook } from '@/hooks/domControls';

let isCollapse = ref<boolean>(false);
const menuStore = useMenuStore();

let { fold } = storeToRefs(menuStore);
watch(fold, (val) => {
  isCollapse.value = val;
});

const layoutContentRef = ref();
const maxHeight = useDomControlsHook(layoutContentRef);
</script>

<style lang="scss" scoped>
.el-header {
  padding: 0;
  height: 80px;
}
</style>
