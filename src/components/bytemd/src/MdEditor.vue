<template>
  <Editor ref="bytemdRef" :value="input" :plugins="plugins" :locale="zhHans" :editorConfig="editorConfig" @change="handleChange" :style="{ height: editorHeight + 'px' }" />
  <!-- <Viewer :value="input" class="viewer" :tabindex="2" /> -->
</template>

<script setup lang="ts">
import gfm from '@bytemd/plugin-gfm';
import gemoji from '@bytemd/plugin-gemoji';
import breaks from '@bytemd/plugin-breaks';
import frontmatter from '@bytemd/plugin-frontmatter';
import math from '@bytemd/plugin-math-ssr';
import highlight from '@bytemd/plugin-highlight'; // 代码高亮
import mediumZoom from '@bytemd/plugin-medium-zoom'; // 缩放图片
import { Editor, Viewer } from '@bytemd/vue-next';
import zhHans from 'bytemd/locales/zh_Hans.json'; // 汉化
import 'bytemd/dist/index.css'; // markdown编辑器样式
import '../style/cyanosis.scss';
import { useDomControlsHook } from '@/hooks/domControls';
import { reactive, ref, toRefs } from 'vue';

const bytemdRef = ref();
const editorHeight = useDomControlsHook(bytemdRef);

const plugins = [gfm(), highlight(), gemoji(), mediumZoom(), breaks(), math(), frontmatter()];

const input = ref('');

const config = reactive({
  editorConfig: {
    theme: 'cyanosis',
    addModeClass: true,
  },
});
const { editorConfig } = toRefs(config);

const handleChange = (v: string) => {
  input.value = v;
};
</script>

<style lang="scss" scoped></style>
