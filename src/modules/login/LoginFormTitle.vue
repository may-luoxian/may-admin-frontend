<template>
  <h2 class="text-3xl font-bold">{{ getFormTitle }}</h2>
</template>

<script lang="ts" setup>
import { computed, unref } from 'vue';
import { useI18n } from 'vue-i18n';
import { LoginStateEnum } from '@/modules/login/useLogin';
import { useLoginState } from '@/modules/login/useLogin';

const { getLoginState } = useLoginState();
const { t } = useI18n();

const getFormTitle = computed(() => {
  const titleObj = {
    [LoginStateEnum.LOGIN]: t('login.signInTitle'),
    [LoginStateEnum.REGISTER]: t('login.signUpTitle'),
    [LoginStateEnum.RESET_PASSWORD]: t('login.forgetFormTitle'),
  };
  return titleObj[unref(getLoginState)];
});
</script>

<style lang="scss" scoped></style>
