<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tabClick="handleTabClick">
      <el-tab-pane :label="`Case${index + 1}`" :name="index" v-for="(item, index) in judgeCase" :key="index">
        <div v-for="(argument, argIndex) in splitArguments(item.input)" :key="argIndex">
          <div>参数{{ argIndex + 1 }}=</div>
          <el-input :value="argument"></el-input>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { toRefs, ref } from 'vue';

import type { JudgeCase } from '../interface';
interface Props {
  judgeCase: Array<JudgeCase>;
  activeCase: number;
}

const props = withDefaults(defineProps<Props>(), {
  judgeCase: () => {
    return [];
  },
  activeCase: 0,
});
const emit = defineEmits(['update:activeCase']);

const { judgeCase } = toRefs(props);

const activeName = ref(0);

/**
 * 拆分入参
 */
const splitArguments = (item: string) => {
  return item.split(' ');
};
/**
 * 切换Tab
 */
const handleTabClick = (pane: any) => {
  emit('update:activeCase', pane.paneName);
};
</script>

<style lang="scss" scoped></style>
