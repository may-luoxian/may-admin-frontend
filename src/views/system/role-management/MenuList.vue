<template>
  <div>
    <el-input class="mb-4" v-model="queryParams.name" placeholder="请输入菜单名称（enter查询）" @keyup.enter="init" clearable style="width: 240px" />
    <el-tree ref="treeRef" class="tree-node" :data="menuTree" node-key="id" :props="defaultProps" show-checkbox default-expand-all>
      <template #default="{ node, data }">
        <i class="mr-2" :class="'iconfont ' + data.icon"></i>
        <span>{{ node.label }}</span>
      </template>
    </el-tree>
  </div>
</template>

<script setup lang="ts">
import { defHttp } from '@/utils/http/axios';
import { onMounted, reactive, toRefs, ref } from 'vue';

const defaultProps = {
  children: 'children',
  label: 'label',
};

const menuData = reactive<any>({
  menuTree: [],
});
const { menuTree } = toRefs(menuData);
const treeRef = ref();

interface QueryParams {
  name?: string;
}

const queryParams = reactive<QueryParams>({});

onMounted(() => {
  init();
});

const init = () => {
  getRoleMenu();
};

const getRoleMenu = () => {
  defHttp
    .get({
      url: '/admin/role/menus',
      params: queryParams,
    })
    .then(({ data }) => {
      menuData.menuTree = data;
    });
};

const handleSetChecked = (menuIds: Array<number>) => {
  let checkTreeNode = [];
  let parentNodes = [];
  for (let item of menuIds) {
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
