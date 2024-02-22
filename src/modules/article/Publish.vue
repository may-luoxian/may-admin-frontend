<template>
  <div class="h-full">
    <el-button @click="testStorage">testStorage</el-button>
    <el-button @click="testRemoveS">testRemoveS</el-button>
  </div>
</template>

<script lang="ts" setup>
import { useStorageHook } from '@/hooks/storage';
import { MAY_STORAGE } from '@/setting/localeSetting';
const useStorage = useStorageHook();
const { setObjectStorage, removeObjectStorage } = useStorage;
const testStorage = function () {
  setObjectStorage(sessionStorage, 'test', 'abc', {
    username: 123,
    password: 123,
  });
};

const testRemoveS = function () {
  removeObjectStorage(sessionStorage, MAY_STORAGE, 'menuTab');
};
</script>

<style lang="scss" scoped></style>
