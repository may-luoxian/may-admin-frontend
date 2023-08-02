<template>
  <div>
    <div v-for="item in data" :key="item.id">{{ item.id }}</div>
  </div>
</template>

<script setup lang="ts">
const TEST = [
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 4,
  },
  {
    id: 5,
  },
  {
    id: 6,
  },
  {
    id: 7,
  },
  {
    id: 8,
  },
  {
    id: 9,
  },
  {
    id: 10,
  },
  {
    id: 11,
  },
  {
    id: 1,
  },
  {
    id: 1,
  },
  {
    id: 1,
  },
  {
    id: 1,
  },
  {
    id: 1,
  },
];
import { onMounted, ref } from 'vue';

let data = ref<any>([]);
onMounted(() => {
  data.value = TEST;
});
</script>

<style lang=""></style>
