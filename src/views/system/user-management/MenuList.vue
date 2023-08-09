<template>
  <div>
    <el-tree :data="menuTree" class="tree-node" :props="defaultProps" show-checkbox>
      <template #default="{ node, data }">
        <i class="mr-2" :class="'iconfont ' + data.icon"></i>
        <span>{{ node.label }}</span>
      </template>
    </el-tree>
  </div>
</template>

<script setup lang="ts">
import api from '@/api/api';
import { onMounted, reactive, toRefs } from 'vue';

const defaultProps = {
  children: 'children',
  label: 'label',
}
const menuData = reactive<any>({
  menuTree: [],
});
const { menuTree } = toRefs(menuData);

onMounted(() => {
  init();
});

const init = () => {
  getRoleMenu();
};

const getRoleMenu = () => {
  api.getRoleMenu().then(({ data }) => {
    menuData.menuTree = data;
  });
};
</script>

<style lang="scss" scoped>
.tree-node {
  @apply text-lg;
  &:deep(.el-tree-node__content) {
    @apply py-4;
    label.el-checkbox  {
      @apply mr-4;
    }
  }
}
</style>
