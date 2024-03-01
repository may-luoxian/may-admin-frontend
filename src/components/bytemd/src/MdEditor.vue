<template>
  <Editor ref="bytemdRef" class="h-full" :value="input" :plugins="plugins" :locale="zhHans" :editorConfig="editorConfig" :uploadImages="handleUploadImage" @change="handleChange" />
  <!-- <Viewer :value="input" class="viewer" :tabindex="2" /> -->
</template>

<script setup lang="ts">
import gfm from '@bytemd/plugin-gfm';
import gemoji from '@bytemd/plugin-gemoji';
import breaks from '@bytemd/plugin-breaks';
import frontmatter from '@bytemd/plugin-frontmatter';
import math from '@bytemd/plugin-math-ssr'; // 数学公式
import highlight from '@bytemd/plugin-highlight'; // 代码高亮
import mediumZoom from '@bytemd/plugin-medium-zoom'; // 缩放图片
import mermaid from '@bytemd/plugin-mermaid'; // 各种图
import mermaidZh from '@bytemd/plugin-mermaid/locales/zh_Hans.json'; // 图的汉化
import * as Bytemd from '@bytemd/vue-next';
import zhHans from 'bytemd/locales/zh_Hans.json'; // 汉化
import 'bytemd/dist/index.css'; // markdown编辑器基础样式
import '../style/cyanosis.scss'; // markdown编辑器配置样式
import { reactive, ref, toRefs, type Component } from 'vue';

const { Editor, Viewer } = Bytemd as {
  Editor: Component;
  Viewer: Component;
};

const plugins = [gfm(), highlight(), gemoji(), mediumZoom(), breaks(), math({ locale: { block: '块级公式', blockText: '公式', inline: '行内公式', inlineText: '公式' } }), frontmatter(), mermaid({ locale: mermaidZh })];

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

const handleUploadImage = (file: File[]) => {
  console.log(file);
  return file;
};
</script>

<style lang="scss" scoped></style>
