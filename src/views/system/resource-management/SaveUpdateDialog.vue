<template>
  <div>
    <el-dialog v-model="visibleDialog" width="800" center destroy-on-close :title="title" @close="close">
      <el-form ref="formRef" :model="formData" label-width="100" size="large">
        <el-form-item label="资源名称：" prop="resourceName" :rules="rules.resourceName">
          <el-input v-model="formData.resourceName" placeholder="请输入资源名称"></el-input>
        </el-form-item>
        <el-form-item label="请求类型：" prop="requestMethod" :rules="isModel ? [] : rules.requestMethod">
          <el-radio-group v-model="formData.requestMethod" :disabled="isModel">
            <el-radio label="GET"></el-radio>
            <el-radio label="POST"></el-radio>
            <el-radio label="PUT"></el-radio>
            <el-radio label="DELETE"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="请求路径：" prop="url" :rules="isModel ? [{ required: false }] : rules.url">
          <el-input v-model="formData.url" placeholder="请输入请求路径" :disabled="isModel"></el-input>
        </el-form-item>
        <el-form-item label="匿名访问：" prop="isAnonymous" :rules="rules.isAnonymous">
          <el-radio-group v-model="formData.isAnonymous">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleConfirm(formRef)">确定</el-button>
        <el-button @click="close">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, computed, unref } from 'vue';
import { SAVEORUPDATE_DIALOG_STATE } from '@/enums/menuEnum';
import { ElNotification, type FormInstance, type FormRules } from 'element-plus';
import { defHttp } from '@/utils/http/axios';

const props = withDefaults(
  defineProps<{
    status: number;
    selectedRow: any;
  }>(),
  {
    selectedRow: {},
  }
);

const emit = defineEmits(['init']);

const { status, selectedRow } = toRefs(props);

const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  resourceName: [{ required: true, message: '资源名称不能为空', trigger: 'blur' }],
  requestMethod: [{ required: true, message: '请求类型不能为空', trigger: 'change' }],
  url: [{ required: true, message: '请求路径不能为空', trigger: 'blur' }],
  isAnonymous: [{ required: true, message: '是否匿名不能为空', trigger: 'change' }],
});

let visibleDialog = ref<boolean>(false);
let title = ref<string>('');
let form = reactive<any>({
  formData: {
    requestMethod: 'GET',
    isAnonymous: 0,
  },
});
let { formData } = toRefs(form);

const open = () => {
  if (status.value === SAVEORUPDATE_DIALOG_STATE.SAVE_ROOT) {
    title.value = '新增模块';
    form.formData.requestMethod = '';
  } else if (status.value === SAVEORUPDATE_DIALOG_STATE.SAVE_CHILD) {
    title.value = '新增资源';
    form.formData.requestMethod = 'GET';
    form.formData.parentId = unref(selectedRow).id;
  } else {
    title.value = '修改资源';
    let { id, resourceName, requestMethod, url, isAnonymous } = unref(selectedRow);
    form.formData = { id, resourceName, requestMethod, url, isAnonymous };
  }
  visibleDialog.value = true;
};

const handleConfirm = (formRef: FormInstance | undefined) => {
  if (!formRef) {
    return;
  }
  formRef.validate((valid) => {
    if (valid) {
      defHttp
        .post({
          url: '/admin/resource/resources',
          data: form.formData,
        })
        .then((res: any) => {
          ElNotification({
            title: 'success',
            type: 'success',
            message: res.message,
          });
          close();
          emit('init');
        });
    }
  });
};

const close = () => {
  form.formData = {
    requestMethod: 'GET',
    isAnonymous: 0,
  };
  formRef.value?.resetFields();
  visibleDialog.value = false;
};

const isModel = computed(
  () => status.value === SAVEORUPDATE_DIALOG_STATE.SAVE_ROOT || (status.value === SAVEORUPDATE_DIALOG_STATE.UPDATE && selectedRow.value.isModel === 1)
);

defineExpose({
  open,
});
</script>

<style lang="scss" scoped></style>
