<template>
  <div>
    <el-tree :data="treeData" class="tree-node" :props="defaultProps" show-checkbox />
  </div>
</template>

<script setup lang="ts">
import api from '@/api/api';
import { onMounted, reactive, toRefs } from 'vue';
const defaultProps = {
  children: 'children',
  label: 'label',
};
let resourceData = reactive<any>({
  treeData: [],
});
let { treeData } = toRefs(resourceData);

onMounted(() => {
  init();
});

const init = () => {
  getResourceLabel();
};

const getResourceLabel = () => {
  api.getRoleResource().then((res) => {
    resourceData.treeData = res.data;
  });
};
</script>

<style lang="scss" scoped>
.tree-node {
  @apply text-lg;
  &:deep(.el-tree-node__content) {
    @apply py-4;
    label.el-checkbox {
      @apply mr-4;
    }
  }
}
</style>
