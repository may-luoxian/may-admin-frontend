<template>
  <div class="may-container bg-style2 flex gap-2">
    <el-card class="w-1/2">
      <MdViewer ref="mdViewerRef" :value="viewerValue" />
    </el-card>
    <el-card class="w-1/2">
      <MonacoEditor ref="monacoEditorRef" />
    </el-card>
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
:deep(.el-card__body) {
  height: calc(100vh - 120px);
  @apply overflow-auto;
}
</style>
