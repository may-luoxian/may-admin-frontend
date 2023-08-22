<template>
  <div>
    <el-tree ref="treeRef" class="tree-node" node-key="id" :data="treeData" :props="defaultProps" show-checkbox />
  </div>
</template>

<script setup lang="ts">
import api from '@/api/api';
import { onMounted, reactive, ref, toRefs } from 'vue';
const defaultProps = {
  children: 'children',
  label: 'label',
};

let resourceData = reactive<any>({
  treeData: [],
});
let { treeData } = toRefs(resourceData);
let treeRef = ref();

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

const handleSetChecked = (resourceIds: Array<number>) => {
  treeRef.value.setCheckedKeys(resourceIds);
};

const getCheckedKeys = () => {
  return treeRef.value.getCheckedKeys();
};

defineExpose({
  handleSetChecked,
  getCheckedKeys
});
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
