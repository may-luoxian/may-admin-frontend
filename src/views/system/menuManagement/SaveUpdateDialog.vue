<template>
  <div>
    <el-dialog v-model="visibleDialog" title="新增菜单" @open="open">
      <el-form></el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

let visibleDialog = ref<boolean>(false);

const open = () => {
  visibleDialog.value = true;
};

defineExpose({
  open,
});
</script>

<style lang="scss" scoped></style>
