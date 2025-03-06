<template>
  <div class="may-dark-switch" :class="isDark ? '' : 'may-dark-switch--dark'" @click="toggleDarkMode">
    <div class="may-dark-switch-inner"></div>
    <SvgIcon name="sun" size="14" />
    <SvgIcon name="moon" size="14" />
  </div>
</template>

<script lang="ts" setup>
import { SvgIcon } from '@/components/icon';
import { useAppStore } from '@/stores/modules/app';
import { useDark, useToggle } from '@vueuse/core';
import { nextTick } from 'vue';

const isDark = useDark({
  storage: localStorage,
  storageKey: 'may-blog-theme',
});
const appstore = useAppStore();

// 切换风格
function toggleDarkMode(event: MouseEvent) {
  let toggleDark = useToggle(isDark);

  const isAppearanceTransition =
    // @ts-expect-error This is an experimental method
    document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!isAppearanceTransition || !event) {
    toggleDark();
    appstore.toggleTheme(isDark.value);
    return;
  }

  // 进行过渡动画
  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  // @ts-expect-error startViewTransition
  const transition = document.startViewTransition(async () => {
    toggleDark();
    appstore.toggleTheme(isDark.value);
    await nextTick();
  });
  transition.ready.then(() => {
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
    document.documentElement.animate(
      {
        clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 450,
        easing: 'ease-in',
        pseudoElement: isDark.value ? '::view-transition-old(root)' : '::view-transition-new(root)',
      }
    );
  });
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
    transition:
      transform 0.5s,
      background-color 0.5s;
    will-change: transform;
  }

  &--dark {
    .#{$prefix-cls}-inner {
      transform: translateX(calc(100% + 2px));
    }
  }
}
</style>
