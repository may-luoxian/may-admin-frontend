import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue';

export const useDomControlsHook = (elRef: Ref<HTMLElement>) => {
  const maxHeight = ref(0);
  const fn = () => {
    computedMaxHeight();
  };
  onMounted(() => {
    computedMaxHeight();
    window.addEventListener('resize', fn);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', fn);
  });

  function computedMaxHeight() {
    const el: any = elRef?.value || elRef;
    const offsetTop = el?.offsetTop || el.$el?.offsetTop || 0;
    maxHeight.value = window.innerHeight - offsetTop;
  }
  return maxHeight;
};
