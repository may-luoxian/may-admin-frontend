<template>
  <el-dropdown trigger="click" @command="changeLocale">
    <span class="el-dropdown-link">
      <Icon icon="ion:language" :color="getTheme ? '#fff' : ''" />
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in LocaleList" :key="item.event" :command="item.event">{{ item.text }}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { Icon } from '@/components/icon';
import { useAppStore } from '@/stores/modules/app';
import { LocaleList } from '@/locales/index';
import { storeToRefs } from 'pinia';

const appStore = useAppStore();
let { getTheme } = storeToRefs(appStore);
//切换语言
const changeLocale = (val: string) => {
  appStore.changeLocale(val);
};
</script>

<style lang="scss" scoped></style>
