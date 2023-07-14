<template>
  <div>
    <el-button @click="testStorage">testStorage</el-button>
    <el-button @click="testRemoveS">testRemoveS</el-button>
  </div>
</template>

<script lang="ts" setup>
import { useStorage } from '@/hooks/storage';
const useStorageHook = useStorage();
const { setObjectStorage, removeObjectStorage } = useStorageHook
const testStorage = function () {
  setObjectStorage(sessionStorage, "test", "abc", {
    username: 123,
    password: 123
  })
}

const testRemoveS = function () {
  removeObjectStorage(sessionStorage, "test", "abc")
}
</script>

<style lang="scss" scoped></style>
