<template>
  <div class="may-container flex gap-4">
    <div class="w-1/2">
      <el-card class="left-content">
        <template #header>
          <el-button class="inline-block" text>题目描述</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button class="inline-block" text>提交记录</el-button>
        </template>
        <MdViewer :value="viewerValue" />
      </el-card>
    </div>
    <div class="w-1/2 flex flex-col gap-4">
      <el-card class="monaco-card h-2/3">
        <template #header>
          <el-select placeholder="代码" style="width: 140px"></el-select>
        </template>
        <MonacoEditor />
        <template #footer>
          <div class="float-right">
            <el-button>运行</el-button>
            <el-button type="success">提交</el-button>
          </div>
        </template>
      </el-card>
      <el-card class="judge-case h-1/3">
        <template #header>
          <el-button class="inline-block" text>测试结果</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button class="inline-block" text>测试用例</el-button>
        </template>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MonacoEditor } from '@/components/monacoEditor';
import { MdViewer } from '@/components/bytemd';
import { ref, onMounted } from 'vue';
import { defHttp } from '@/utils/http/axios';

const viewerValue = ref('');

onMounted(() => {
  defHttp
    .get({
      url: '/oj/value',
    })
    .then((res) => {
      viewerValue.value = res.result.data;
    });
});
</script>

<style lang="scss" scoped>
.left-content {
  :deep(.el-card__header) {
    @apply px-2 py-0 h-10 leading-10;
  }
  :deep(.el-card__body) {
    height: calc(100vh - 160px);
    @apply overflow-auto;
  }
}
.monaco-card {
  :deep(.el-card__body) {
    height: calc(100% - 80px);
  }
  :deep(.el-card__header) {
    @apply px-4 py-0 leading-10 h-10;
  }
  :deep(.el-card__footer) {
    @apply px-4 py-0 leading-10 h-10;
  }
}
.judge-case {
  :deep(.el-card__header) {
    @apply px-4 py-0 leading-10 h-10;
  }
}
</style>
