<template>
  <div class="h-full bg-slate-50">
    <el-button @click="testStorage">testStorage</el-button>
    <el-button @click="testRemoveS">testRemoveS</el-button>
    <el-button @click="testGet">testGet</el-button>
    <el-button @click="getStatStorage">getStatStorage</el-button>
  </div>
</template>

<script lang="ts" setup>
import { useStorageHook } from '@/hooks/storage';
import { MAY_STORAGE } from '@/setting/localeSetting';
const useStorage = useStorageHook();
const { setObjectStorage, removeObjectStorage, getStorage, getObjectStorage } = useStorage;
const testStorage = function () {
  setObjectStorage(sessionStorage, 'test', 'abc', {
    username: 123,
    password: 123,
  });
};

const testRemoveS = function () {
  removeObjectStorage(sessionStorage, MAY_STORAGE, 'menuTab');
};

function testGet() {
  let result = getStorage(sessionStorage, MAY_STORAGE);
}
function getStatStorage() {
  let result = getObjectStorage(sessionStorage, MAY_STORAGE, 'menuTab');
}
</script>

<style lang="scss" scoped></style>
