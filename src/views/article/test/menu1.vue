<template>
  <div>
    <el-button @click="handleOpenDialig">打开弹窗</el-button>
    <el-dialog v-model="visibleDialog" title="菜单一">
      <MenuComponent v-if="visibleDialog"/>
    </el-dialog>
    <el-button @click="getRoles">获取角色列表</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import api from '@/api/api';
import MenuComponent from '@/views/components/MenuComponent.vue'

let visibleDialog = ref<boolean>(false);
const handleOpenDialig = () => {
  visibleDialog.value = true
}



const getRoles = () => {
  api.getRoles({}).then((res) => {
    console.log(res)
  })
}

</script>

<style lang="scss" scoped></style>
