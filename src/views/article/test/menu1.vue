<template>
  <div>
    <el-button @click="handleOpenDialig">打开弹窗</el-button>
    <el-dialog v-model="visibleDialog" title="菜单一">
      <MenuComponent v-if="visibleDialog" />
    </el-dialog>
    <el-button @click="getRoles">点我变红</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MenuComponent from '@/views/components/MenuComponent.vue';

let visibleDialog = ref<boolean>(false);
// let textColor = ref<string>('red');
const handleOpenDialig = () => {
  visibleDialog.value = true;
};

// let ws = new WebSocket('ws://localhost:3000/socket');
// ws.onopen = () => {
//   console.log('成功');
// };

const getRoles = () => {
  // textColor.value = 'blue'
  // ws.send(
  //   JSON.stringify({
  //     test: 123,
  //   })
  // );
};
</script>

<style lang="scss" scoped></style>
