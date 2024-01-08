<template>
  <div>
    <el-tree ref="treeRef" class="tree-node" node-key="id" :data="treeData" :props="defaultProps" show-checkbox />
  </div>
</template>

<script setup lang="ts">
import { defHttp } from '@/utils/http/axios';
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
  defHttp
    .get({
      url: '/admin/role/resources',
    })
    .then((res) => {
      resourceData.treeData = res.data;
    });
};

const handleSetChecked = (resourceIds: Array<number>) => {
  let checkTreeNode = [];
  let parentNodes = [];
  for (let item of resourceIds) {
    let node = treeRef.value.getNode(item);
    if (node && node.isLeaf) {
      checkTreeNode.push(item);
    } else if (node) {
      parentNodes.push(node);
    }
  }
  treeRef.value.setCheckedKeys(checkTreeNode);
  for (let node of parentNodes) {
    do {
      if (!node.checked && !node.indeterminate) {
        node.indeterminate = true;
      }
      node = node.parent;
    } while (node);
  }
};

const getCheckedKeys = () => {
  let checkedNodes = treeRef.value.getCheckedNodes(false, true);
  return checkedNodes.map((node: any) => node.id);
};

defineExpose({
  handleSetChecked,
  getCheckedKeys,
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
