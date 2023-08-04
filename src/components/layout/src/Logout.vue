<template>
  <div class="flex h-full items-center w-32 justify-evenly cursor-pointer hover:bg-slate-200">
    <img class="w-7 h-7 rounded-full" :src="getUserInfo.avatar" alt="error" />
    <span class="text-sm text-slate-500">{{ getUserInfo.nickname }}</span>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
let { getUserInfo } = userStore;
</script>

<style lang="scss"></style>
