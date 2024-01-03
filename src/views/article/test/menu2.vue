<template>
  <div>
    <el-button @click="handleOpenDialig">打开弹窗</el-button>
    <el-dialog v-model="visibleDialog" title="菜单二">
      <MenuComponent v-if="visibleDialog" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 引入组件
import MenuComponent from '@/views/components/MenuComponent.vue';

let visibleDialog = ref<boolean>(false);
const handleOpenDialig = () => {
  visibleDialog.value = true;
};
</script>

<style lang="scss" scoped></style>
