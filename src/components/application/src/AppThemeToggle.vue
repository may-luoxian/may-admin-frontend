<template>
  <div class="may-dark-switch" :class="isDark ? '' : 'may-dark-switch--dark'" @click="toggleDarkMode">
    <div class="may-dark-switch-inner"></div>
    <SvgIcon name="sun" size="14" />
    <SvgIcon name="moon" size="14" />
  </div>
</template>

<script lang="ts" setup>
import { SvgIcon } from '@/components/icon';
import { useAppStore } from '@/stores/app';
import { useDark, useToggle } from '@vueuse/core';
const isDark = useDark();
const appstore = useAppStore();

// 切换风格
function toggleDarkMode() {
  let toggleDark = useToggle(isDark);
  toggleDark();
  appstore.toggleTheme(isDark.value);
  let htmlRoot = document.getElementById('htmlRoot');
  let htmlTheme = isDark.value ? 'dark' : 'light';
  htmlRoot?.setAttribute('data-theme', htmlTheme);
}
</script>
<style lang="scss" scoped>
$prefix-cls: 'may-dark-switch';

html[data-theme='dark'] {
  .#{$prefix-cls} {
    border: 1px solid rgb(196 188 188);
  }
}

.#{$prefix-cls} {
  position: relative;
  display: flex;
  width: 50px;
  height: 26px;
  padding: 0 6px;
  margin-left: auto;
  cursor: pointer;
  background-color: #151515;
  border-radius: 30px;
  justify-content: space-between;
  align-items: center;

  &-inner {
    position: absolute;
    z-index: 1;
    width: 18px;
    height: 18px;
    background-color: #fff;
    border-radius: 50%;
    transition: transform 0.5s, background-color 0.5s;
    will-change: transform;
  }

  &--dark {
    .#{$prefix-cls}-inner {
      transform: translateX(calc(100% + 2px));
    }
  }
}
</style>
