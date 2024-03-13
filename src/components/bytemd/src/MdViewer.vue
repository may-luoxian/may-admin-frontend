<template>
  <Viewer :value="value" :plugins="plugins"></Viewer>
</template>

<script setup lang="ts">
import * as Bytemd from '@bytemd/vue-next';
import gfm from '@bytemd/plugin-gfm';
import gemoji from '@bytemd/plugin-gemoji';
import breaks from '@bytemd/plugin-breaks';
import frontmatter from '@bytemd/plugin-frontmatter';
import math from '@bytemd/plugin-math-ssr'; // 数学公式
import highlight from '@bytemd/plugin-highlight'; // 代码高亮
import mediumZoom from '@bytemd/plugin-medium-zoom'; // 缩放图片
import mermaid from '@bytemd/plugin-mermaid'; // 各种图
import mermaidZh from '@bytemd/plugin-mermaid/locales/zh_Hans.json'; // 图的汉化
import 'bytemd/dist/index.css'; // markdown编辑器基础样式
import '../style/cyanosis.scss'; // markdown编辑器配置样式
import { toRefs, type Component } from 'vue';

interface Props {
  value: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
});

const { value } = toRefs(props);

const plugins = [gfm(), highlight(), gemoji(), mediumZoom(), breaks(), math({ locale: { block: '块级公式', blockText: '公式', inline: '行内公式', inlineText: '公式' } }), frontmatter(), mermaid({ locale: mermaidZh })];

const { Viewer } = Bytemd as {
  Editor: Component;
  Viewer: Component;
};
</script>

<style lang="scss" scoped></style>
