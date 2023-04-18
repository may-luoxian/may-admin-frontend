<template>
  <svg class="svg-icon svg-icon-spin" aria-hidden="true" :style="getStyle">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue';
import { computed } from 'vue';
const props = defineProps({
  // icon prefix
  prefix: {
    type: String,
    default: 'icon'
  },
  // icon name
  name: {
    type: String,
    required: true,
  },
  // TODO:该组件icon暂时不需要设置颜色，若需要建议封装新组件
  // icon color
  // color: {
  //   type: String,
  //   default: '#333'
  // },
  // icon size
  size: {
    type: [Number, String],
    default: 16
  }
})
const getStyle = computed((): CSSProperties => {
  const { size } = props;
  let s = `${size}`;
  s = `${s.replace('px', '')}px`;
  return {
    width: s,
    height: s,
  }
})
const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>

<style lang="scss" scoped>
.svg-icon {
  display: inline-block;
  overflow: hidden;
  vertical-align: -0.15em;
  fill: currentColor;
}
.svg-icon-spin {
    animation: loadingCircle 1s infinite linear;
  }
</style>
