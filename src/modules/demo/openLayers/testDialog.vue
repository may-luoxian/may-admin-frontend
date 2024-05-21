<template>
  <div class="w-40 h-28 bg-cyan-700">
    <div>这是一个测试弹窗</div>
    <div>测试Prop: {{ hdms }}</div>
    <button @click="handleClose">关闭弹窗</button>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';

interface Props {
  hdms: string;
}

const props = withDefaults(defineProps<Props>(), {
  hdms: '',
});

const emit = defineEmits(['handleClose']);

const { hdms } = toRefs(props);

const handleClose = () => {
  emit('handleClose');
};
</script>

<style lang="scss" scoped></style>
