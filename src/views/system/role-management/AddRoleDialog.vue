<template>
  <div>
    <el-dialog v-model="visible" title="新增角色" width="400" @open="open">
      <el-form ref="roleFormRef" :model="form" :rules="rules" label-width="80">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" class="w-full"></el-input>
        </el-form-item>
        <el-form-item label="是否禁用" prop="isDisable">
          <el-select v-model="form.isDisable" class="w-full">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色描述" prop="describe">
          <el-input v-model="form.describe" class="w-full"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleConfirm" :loading="loading">确定</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElNotification, type FormInstance, type FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { defHttp } from '@/utils/http/axios';

const emit = defineEmits(['init']);

interface Form {
  roleName?: string;
  isDisable?: number;
  describe?: string;
}

const visible = ref(false);
const loading = ref(false);
const form = reactive<Form>({
  isDisable: 0,
});
const roleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  roleName: [
    {
      required: true,
      message: '请输入角色名称',
    },
  ],
  isDisable: [
    {
      required: true,
      message: '请选择是否禁用',
    },
  ],
});

const open = () => {
  visible.value = true;
};

const handleConfirm = () => {
  roleFormRef.value?.validate((valid) => {
    if (!valid) return;
    defHttp
      .post({
        url: '/admin/role/roles',
        data: form,
      })
      .then((res) => {
        loading.value = true;
        ElNotification({
          type: 'success',
          title: 'Success',
          message: res.message,
        });
        emit('init');
      })
      .finally(() => {
        loading.value = false;
        handleCancel();
      });
  });
};

const handleCancel = () => {
  visible.value = false;
  roleFormRef.value?.resetFields();
};

defineExpose({
  open,
});
</script>

<style lang="scss" scoped></style>
