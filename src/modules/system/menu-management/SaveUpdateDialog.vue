<template>
  <div>
    <el-dialog v-model="visibleDialog" width="800" center destroy-on-close :title="title" @close="close">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120" size="large">
        <el-form-item label="菜单类型：" prop="menuType">
          <el-radio-group v-model="form.menuType" class="ml-4">
            <el-radio :label="0">目录</el-radio>
            <el-radio :label="1">菜单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称：" prop="name" required>
          <el-input v-model="form.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单路径：" prop="path" required>
          <el-input v-model="form.path" placeholder="请输入菜单路径" />
        </el-form-item>
        <el-form-item label="组件路径：" prop="component" required>
          <el-input v-model="form.component" placeholder="请输入组件路径" :disabled="isCatalogue" />
        </el-form-item>
        <el-form-item label="图标：" prop="icon" required>
          <el-input v-model="form.icon" placeholder="请输入图标名称" />
        </el-form-item>
        <el-form-item label="排序：" prop="orderNum" required>
          <el-input v-model="form.orderNum" placeholder="请输入菜单排序" />
        </el-form-item>
        <el-form-item label="是否隐藏：" prop="isHidden">
          <el-switch v-model="form.isHidden" :active-value="1" :inactive-value="0" active-text="隐藏" inactive-text="显示" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="confirm">确定</el-button>
        <el-button @click="close">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { type Ref, reactive, ref, toRef, unref, computed, watch, nextTick } from 'vue';
import { type FormInstance, type FormRules, ElNotification } from 'element-plus';
import { MENU_TYPE, SAVEORUPDATE_DIALOG_STATE } from '@/enums/menuEnum';
import { defHttp } from '@/utils/http/axios';

const props = defineProps<{
  saveUpdateDialogTitle: string;
  saveUpdateDialogState: number;
}>();

const emit = defineEmits(['init']);

const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  name: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
  path: [{ required: true, message: '菜单路径不能为空', trigger: 'blur' }],
  component: [{ required: true, message: '组件路径不能为空', trigger: 'blur' }],
  icon: [{ required: true, message: '菜单图标不能为空', trigger: 'blur' }],
  orderNum: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
});
let visibleDialog = ref<boolean>(false);
let menuData = reactive<any>({
  form: {
    menuType: 0,
    isHidden: 0,
  },
  selectedData: {},
});
let form: any = toRef(menuData, 'form');
let title: Ref<string> = toRef(props, 'saveUpdateDialogTitle');
let dialogState: Ref<number> = toRef(props, 'saveUpdateDialogState');

const initUpdateData = () => {
  let { id, menuType, name, path, component, icon, orderNum, isHidden } = menuData.selectedData;
  menuData.form = { id, menuType, name, path, component, icon, orderNum, isHidden };
};

const open = async (row: any) => {
  menuData.selectedData = row;
  visibleDialog.value = true;
  await nextTick();
  if (unref(dialogState) === SAVEORUPDATE_DIALOG_STATE.UPDATE) {
    initUpdateData();
  }
  if (menuData.form.menuType === MENU_TYPE.CATALOGUE) {
    menuData.form.component = 'Layout';
  }
};

const close = () => {
  visibleDialog.value = false;
  menuData.form = {
    menuType: 0,
    isHidden: 0,
  };
  formRef.value?.resetFields();
};

const confirm = () => {
  let data = unref(form);
  if (unref(dialogState) === SAVEORUPDATE_DIALOG_STATE.UPDATE) {
    data.id = menuData.selectedData.id;
  } else if (unref(dialogState) === SAVEORUPDATE_DIALOG_STATE.SAVE_CHILD) {
    data.parentId = menuData.selectedData.id;
  }
  defHttp
    .post({
      url: '/management-center/menus/menu',
      data,
    })
    .then((res: any) => {
      ElNotification({
        title: 'SUCCESS',
        type: 'success',
        message: res.message,
      });
      close();
      emit('init');
    });
};

let isCatalogue = computed(() => menuData.form.menuType === MENU_TYPE.CATALOGUE);

watch(isCatalogue, (newVal) => {
  if (newVal) {
    menuData.form.component = 'Layout';
  } else {
    menuData.form.component = menuData.selectedData?.component || '';
  }
});

defineExpose({
  open,
});
</script>

<style lang="scss" scoped></style>
