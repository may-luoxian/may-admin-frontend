<template>
  <div>
    <el-dialog v-model="visible" width="800" center destroy-on-close :title="title" @close="close">
      <el-form ref="formRef" :model="formData" label-width="120" size="large" :rules="rules">
        <el-form-item label="模块名称：" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="模块宽度：" prop="widthValue">
          <el-radio-group v-model="formData.widthValue" class="ml-4">
            <el-radio :label="item.value" size="large" v-for="item in CARD_WIDTH" :key="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="组件名称：" prop="component">
          <el-input v-model="formData.component"></el-input>
        </el-form-item>
        <el-form-item label="预览图片名称：" prop="previewImg">
          <el-input v-model="formData.previewImg"></el-input>
        </el-form-item>
        <el-form-item label="描述：" prop="description">
          <el-input v-model="formData.description" :rows="2" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleConfirm(formRef)" :loading="loading">确定</el-button>
        <el-button @click="close">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue';
import { ElNotification, type FormInstance, type FormRules } from 'element-plus';
import { CARD_WIDTH } from '@/views/constant/systemConstant';
import { defHttp } from '@/utils/http/axios';
import { isEmpty } from '@/utils/is';

const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  name: [{ required: true, message: '模块名称不能为空', trigger: 'blur' }],
  widthValue: [{ required: true, message: '模块宽度不能为空', trigger: 'change' }],
  component: [{ required: true, message: '组件名称不能为空', trigger: 'blur' }],
});

const emit = defineEmits(['init']);

let visible = ref<boolean>(false);
let loading = ref<boolean>(false);
let isAddOrEdit = ref<string>();
let title = ref<string>();
let form = reactive<any>({
  formData: {},
});
let { formData } = toRefs(form);

const open = (state: string, data: any) => {
  if (!isEmpty(data)) {
    let { id, name, widthValue, component, description } = data;
    formData.value = { id, name, widthValue, component, description };
  }
  isAddOrEdit.value = state;
  visible.value = true;
};

const handleConfirm = (formRef: FormInstance | undefined) => {
  if (!formRef) {
    return;
  }
  formRef.validate(async (valid) => {
    try {
      if (valid) {
        loading.value = true;
        let res = null;
        if (isAddOrEdit.value === 'add') {
          res = await defHttp.post({
            url: '/admin/home/add',
            data: formData.value,
          });
        } else if (isAddOrEdit.value === 'edit') {
          res = await defHttp.post({
            url: '/admin/home/edit',
            data: formData.value,
          });
        }
        if (res.code === 20000) {
          emit('init');
          ElNotification({
            type: 'success',
            message: '操作成功',
          });
          close();
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  });
};

const close = () => {
  formRef.value?.resetFields();
  visible.value = false;
};

defineExpose({
  open,
});
</script>

<style lang="scss" scoped></style>
