<template>
  <div>
    <el-dialog v-model="visibleDialog" width="500" center destroy-on-close title="分配角色" @close="close">
      <el-tree ref="treeRef" :data="roleList" class="tree-node" node-key="id" :props="defaultProps" show-checkbox check-on-click-node />
      <template #footer>
        <el-button type="primary" @click="confirm">确定</el-button>
        <el-button @click="close">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { defHttp } from '@/utils/http/axios';
import { ElNotification } from 'element-plus';
import { reactive, ref, toRefs } from 'vue';

interface DIALOG_DATA {
  userData: any;
  roleList: Array<any>;
}

const defaultProps = {
  children: 'children',
  label: 'roleName',
  disabled: 'disabled',
};

const emit = defineEmits(['init']);

const treeRef = ref<any>();
let visibleDialog = ref<boolean>(false);
let dialogData = reactive<DIALOG_DATA>({
  userData: {},
  roleList: [],
});
let { roleList } = toRefs(dialogData);

const open = async (userData: any) => {
  dialogData.userData = userData;
  visibleDialog.value = true;
  await getRoleList();
  let ids = userData.roles.map((role: any) => role.id);
  treeRef.value.setCheckedKeys(ids);
};

const getRoleList = () => {
  return defHttp
    .get({
      url: '/admin/role/allow',
    })
    .then((res) => {
      dialogData.roleList = res.data;
    });
};

const confirm = () => {
  let roleIds = treeRef.value.getCheckedKeys();
  let id = dialogData.userData.userInfoId;
  defHttp
    .put({
      url: '/admin/role/allow',
      data: {
        id,
        roleIds,
      },
    })
    .then((res: any) => {
      ElNotification({
        title: 'success',
        message: res.message,
        type: 'success',
      });
      close();
      emit('init');
    });
};

const close = () => {
  visibleDialog.value = false;
};

defineExpose({
  open,
});
</script>

<style lang="scss" scoped>
.tree-node {
  @apply text-lg max-h-96;
  &:deep(.el-tree-node__content) {
    @apply py-4;
    label.el-checkbox {
      @apply mr-4;
    }
  }
}
</style>
