<template>
  <div class="h-full">
    <div ref="monacoRef" class="h-full"></div>
    <!-- <div>{{ editorOpt.editorOption.value }}</div> -->
  </div>
</template>

<script setup lang="ts">
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import { ref, onMounted, reactive, watch, nextTick, toRefs } from 'vue';
import { useAppStore } from '@/stores/modules/app.ts';

const monacoRef = ref();
const { themeConfig } = useAppStore();
let monacoEditor = null;

const editorOpt = reactive({
  editorOption: {
    value: 'function twoSum(nums: number[], target: number): number[] {\n  return [];\n}',
    language: 'typescript',
    theme: themeConfig.theme ? 'vs-dark' : 'vs-light',
    automaticLayout: true,
  },
});
onMounted(async () => {
  await nextTick();
  initMonaco();
});

const initMonaco = () => {
  self.MonacoEnvironment = {
    getWorker(_, label) {
      if (label === 'json') {
        return new jsonWorker();
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return new cssWorker();
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return new htmlWorker();
      }
      if (label === 'typescript' || label === 'javascript') {
        return new tsWorker();
      }
      return new editorWorker();
    },
  };
  monacoEditor = monaco.editor.create(monacoRef.value, editorOpt.editorOption);
};

const updateOption = (config: object) => {
  if (monacoEditor) {
    monacoEditor.updateOptions(config);
  }
};

watch(
  () => themeConfig.theme,
  (nv) => {
    const { editorOption } = toRefs(editorOpt);
    if (nv) {
      editorOption.value.theme = 'vs-dark';
    } else {
      editorOption.value.theme = 'vs-light';
    }
    updateOption(editorOption.value);
  }
);
</script>

<style lang="scss" scoped></style>
