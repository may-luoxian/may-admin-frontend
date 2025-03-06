<template>
  <div>
    <el-alert title="提示：输入参数间用空格隔开" type="warning" show-icon />
    <div class="mb-4 mt-4">
      <span class="w-20 inline-block">输入：</span>
      <el-input v-model="input" style="width: calc(100% - 80px)"></el-input>
    </div>

    <div v-if="!isEmpty(debugResult)">
      <div class="may-title">
        测试结果：<span :style="handleTitle()">{{ debugResult.message }}</span>
      </div>
      <div class="mb-4">
        <span class="w-20 inline-block">输出：</span>
        {{ debugResult.output }}
      </div>
      <div class="mb-4">
        <span class="w-20 inline-block">预期结果：</span>
        {{ debugResult.expected }}
      </div>
      <div class="mb-4"><span class="w-20 inline-block">用时：</span>{{ debugResult.time ? debugResult.time + 'ms' : '' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, ref } from 'vue';
import { isEmpty } from '@/utils/is';

interface Props {
  debugResult: any;
}

const props = withDefaults(defineProps<Props>(), {});

const { debugResult } = toRefs(props);

const input = ref('');

const handleTitle = () => {
  if (debugResult.value.message === '答案正确') {
    return {
      color: '#7ec050',
    };
  } else if (debugResult.value.message === '编译错误') {
    return {
      color: '#dca550',
    };
  } else {
    return {
      color: '#e47470',
    };
  }
};

defineExpose({
  input,
});
</script>

<style lang="scss" scoped></style>
