<template>
  <div class="px-5 py-8 w404">
    <LoginFormTitle class="mb-4 enter-x" />
    <el-form :model="form" class="enter-x">
      <el-form-item class="enter-x">
        <el-input class="w-96" v-model="form.username" size="large" :placeholder="t('login.username')" />
      </el-form-item>
      <el-form-item class="enter-x">
        <el-input class="w-96" type="password" v-model="form.password" size="large" :placeholder="t('login.password')" show-password />
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
        <el-button ref="loginBtnRef" class="w-full" size="large" color="#0960bd" @click="handleLogin" :loading="loading">{{ t('login.buttonSignIn') }}</el-button>
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
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/modules/user';
import { useMenuStore } from '@/stores/modules/menu';
import { useMenuHook } from '@/hooks/menu';
import { login, getUserRouter } from '@/api/system';
import LoginFormTitle from '@/views/login/LoginFormTitle.vue';

const router = useRouter();
const userStore = useUserStore();
const menuStore = useMenuStore();
const { t } = useI18n();
const loginBtnRef = ref();

const form = reactive({
  username: 'admin@163.com',
  password: 'syk20010416',
});

const loading = ref(false);
const remenberMe = ref(false);
/**
 * 登录
 * 1、校验用户名密码
 * 2、若登录成功，保存token，userId到缓存中，作为登录状态
 * 3、构建路由、菜单表，跳转到首页
 */
const menuHook = useMenuHook();
function handleLogin() {
  let { username, password } = toRefs(form);
  loading.value = true;
  login(username.value, password.value).then(async ({ data }) => {
    try {
      userStore.setToken(data.token);
      userStore.setUserInfo(data);
      const routes = (await getUserRouter()).data;
      menuHook.dynamicAddRoute(routes);
      menuStore.setIsDynamicAddedRoute(true);
      router.push('/');
    } catch (err) {
      console.error(err);
    } finally {
      loading.value = false;
    }
  });
}
</script>

<style lang="scss" scoped>
.w404 {
  width: 26rem;
}
</style>
