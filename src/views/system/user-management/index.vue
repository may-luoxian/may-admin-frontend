<template>
  <el-header class="may-title">
    角色管理
  </el-header>
  <el-main class="may-container">
    <div class="flex gap-x-10">
      <div ref="roleRef" class="w-full h-full border-slate-200 border-2 rounded border-solid" :style="{ height: roleMaxHeight - 40 + 'px' }">
        <!-- <span class="may-title ml-2">角色列表</span> -->
        <el-table></el-table>
      </div>
      <div ref="resourceRef" class="w-full h-full border-slate-200 border-2 rounded border-solid" :style="{ height: resourceMaxHeight - 40 + 'px' }"></div>
    </div>
  </el-main>
</template>

<script setup lang="ts">
import { useDomControlsHook } from '@/hooks/domControls';
import { ref } from 'vue';

const roleRef = ref();
const resourceRef = ref();
const roleMaxHeight = useDomControlsHook(roleRef);
const resourceMaxHeight = useDomControlsHook(resourceRef);
</script>

<style lang="scss" scope></style>
