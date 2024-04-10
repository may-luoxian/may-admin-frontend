<template>
  <div>
    <el-dialog v-model="visible" width="600" center destroy-on-close title="创建用户" @close="close">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" class="pr-6 pl-6">
        <el-form-item label="登录类型" prop="loginType">
          <el-select v-model="form.loginType" class="w-full" disabled>
            <el-option v-for="item in LOGIN_TYPE" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-upload class="avatar-uploader" :http-request="handleUpload" :show-file-list="false" accept=".jpg, .png">
            <img v-if="form.avatar" :src="form.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="个人介绍" prop="intro">
          <el-input v-model="form.intro"></el-input>
        </el-form-item>
        <el-form-item label="个人网站" prop="website">
          <el-input v-model="form.website"></el-input>
        </el-form-item>
        <el-form-item label="是否订阅" prop="isSubscribe">
          <el-select v-model="form.isSubscribe" class="w-full">
            <el-option v-for="item in IS_ANONYMOUS_CONSTANT" :key="item.id" :value="item.id" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否禁用" prop="isDisable">
          <el-select v-model="form.isDisable" class="w-full">
            <el-option v-for="item in IS_ANONYMOUS_CONSTANT" :key="item.id" :value="item.id" :label="item.label" />
          </el-select>
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
import { LOGIN_TYPE, IS_ANONYMOUS_CONSTANT } from '@/modules/system/constant';
import { defHttp } from '@/utils/http/axios';
import { ElNotification } from 'element-plus';
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';

interface Form {
  loginType?: number;
  email?: string;
  nickname?: string;
  username?: string;
  password?: string;
  avatar?: string;
  intro?: string;
  website?: string;
  isSubscribe?: number;
  isDisable?: number;
}

const visible = ref(false);
const formRef = ref<FormInstance>();
const form = reactive<Form>({
  loginType: 3,
  isSubscribe: 0,
  isDisable: 0,
});
const rules = reactive<FormRules>({
  loginType: [{ required: true, message: '请选择账号类型', trigger: 'change' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  avatar: [{ required: true, message: '请上传头像', trigger: 'blur' }],
  isSubscribe: [{ required: true, message: '请选择是否订阅', trigger: 'change' }],
  isDisable: [{ required: true, message: '请选择是否禁用', trigger: 'change' }],
});

const emit = defineEmits(['init']);

const open = () => {
  visible.value = true;
};

const handleUpload = (e: any) => {
  defHttp
    .uploadFile(
      {
        url: '/api/admin/users/avatar',
      },
      {
        file: e.file,
        filename: e.file.name,
      }
    )
    .then(({ data }) => {
      form.avatar = data.data;
    });
};

const confirm = () => {
  formRef.value?.validate((valid) => {
    if (!valid) return;
    defHttp
      .post({
        url: '/admin/users/user',
        data: form,
      })
      .then((res) => {
        ElNotification.success({
          title: 'Success',
          message: res.data,
        });
        close();
        emit('init');
      });
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

<style lang="scss" scoped>
:deep(.avatar-uploader .el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  img {
    object-fit: cover;
    width: 100px;
    height: 100px;
  }
}

:deep(.avatar-uploader .el-upload:hover) {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}
</style>
