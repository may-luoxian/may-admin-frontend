<template>
  <div class="px-5 py-8 w404">
    <LoginFormTitle class="mb-4 enter-x" />
    <el-form :model="form" class="enter-x">
      <el-form-item class="enter-x">
        <el-input class="w-96" v-model="form.username" size="large" :placeholder="t('login.username')" />
      </el-form-item>
      <el-form-item class="enter-x">
        <el-input class="w-96" type="password" v-model="form.password" size="large" :placeholder="t('login.password')"
          show-password />
      </el-form-item>
      <el-row class="mb-4 enter-x">
        <el-col :span="12">
          <el-checkbox v-model="remenberMe">{{ t('login.rememberMe') }}</el-checkbox>
        </el-col>
        <el-col :span="12" class="text-right">
          <el-link type="primary">{{ t('login.forgetPassword') }}</el-link>
        </el-col>
      </el-row>
      <el-form-item class="enter-x">
        <el-button class="w-full" size="large" color="#0960bd" @click="handleLogin">{{ t('login.buttonSignIn')
        }}</el-button>
      </el-form-item>
      <el-form-item class="enter-x">
        <el-row :gutter="10" class="w-full">
          <el-col :span="8">
            <el-button class="w-full">{{ t('login.mobileSignIn') }}</el-button>
          </el-col>
          <el-col :span="8">
            <el-button class="w-full">{{ t('login.qrSignIn') }}</el-button>
          </el-col>
          <el-col :span="8">
            <el-button class="w-full">{{ t('login.buttonSignUp') }}</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMenu } from '@/hooks/menu';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import api from '@/api/api'
import LoginFormTitle from '@/views/login/LoginFormTitle.vue';

const router = useRouter();
const userStore = useUserStore();
const { t } = useI18n();

const form = reactive({
  username: 'admin',
  password: '123456'
})

const remenberMe = ref(false);
/**
 * 登录
 * 1、校验用户名密码
 * 2、若1成功，请求该用户所拥有权限路由
 * TODO:登录模块未完成，直接获取菜单
 */
const useMenuHook = useMenu();
function handleLogin() {
  let { username, password } = toRefs(form);
  api.login(username.value, password.value).then(async ({ data }) => {
    userStore.setToken(data.token);
    userStore.setUserId(data.id);
    await useMenuHook.dynamicAddRoute();
    router.push('/');
  })
}

</script>

<style lang="scss" scoped>
.w404 {
  width: 26rem;
}
</style>
