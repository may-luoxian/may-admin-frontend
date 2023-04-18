<!--登录-->
<template>
  <div class="relative w-full h-full px-4 may-login">
    <!--风格配置-->
    <div class="absolute flex items-center right-4 top-4">
      <AppThemeToggle class="mr-2 enter-x" />
      <AppLocalPicker class="enter-x" />
    </div>
    <div class="h-full py-2 mx-auto max-w-screen xl:max-w-screen-xl">
      <div class="flex w-full h-full">
        <div class="flex w-full h-full">
          <AppLogo />
        </div>
        <div class="flex w-full h-full">
          <div class="relative mx-auto my-auto">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AppThemeToggle, AppLogo, AppLocalPicker } from '@/components/application';
import LoginForm from '@/views/login/LoginForm.vue';
</script>
<style lang="scss">
html[data-theme='light'] {

  .may-login {

    &::before {
      background-image: url('@/assets/svg/login-bg.svg');
    }
  }
}

.may-login {
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    margin-left: -48%;
    background-image: url('@/assets/svg/login-bg-dark.svg');
    background-position: 100%;
    background-repeat: no-repeat;
    background-size: auto 100%;
  }
}
</style>