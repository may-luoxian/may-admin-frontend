<template>
  <div class="h-full">
    <div ref="monacoRef" class="monaco"></div>
  </div>
</template>

<script setup lang="ts">
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import { ref, onMounted, reactive, watch, nextTick, toRefs } from 'vue';
import { useAppStore } from '@/stores/modules/app';

const monacoRef = ref();
const { themeConfig } = useAppStore();
let monacoInstance: any = null; // 编辑器实例

const editorOpt = reactive({
  editorOption: {
    value: 'function twoSum(nums: number[], target: number): number[] {\n  return [];\n}',
    language: 'typescript',
    theme: themeConfig.theme ? 'vs-dark' : 'vs-light',
    automaticLayout: true,
    fontSize: 18,
  },
  activeValue: '',
});

const { editorOption, activeValue } = toRefs(editorOpt);

onMounted(async () => {
  await nextTick();
  initMonaco();
  registerEventListener();
});

/**
 * 初始化编辑器
 */
const initMonaco = () => {
  window.MonacoEnvironment = {
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
  monacoInstance = monaco.editor.create(monacoRef.value, editorOpt.editorOption);
  activeValue.value = editorOption.value.value;
};

const updateOption = (config: object) => {
  if (monacoInstance) {
    monacoInstance.updateOptions(config);
  }
};

/**
 * 注册编辑器事件
 */
const registerEventListener = () => {
  if (!monacoInstance) {
    return;
  }
  // 监听内容改变
  monacoInstance.onDidChangeModelContent(() => {
    activeValue.value = monacoInstance.getValue();
  });
};

watch(
  () => themeConfig.theme,
  (nv) => {
    if (nv) {
      editorOption.value.theme = 'vs-dark';
    } else {
      editorOption.value.theme = 'vs-light';
    }
    updateOption(editorOption.value);
  }
);
</script>

<style lang="scss" scoped>
.monaco {
  height: 100%;
}
</style>
