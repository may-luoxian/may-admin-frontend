import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue';

export const useDomControlsHook = (elRef: Ref<HTMLElement>) => {
  let maxHeight = ref(0);
  let fn = () => {
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
    let el: any = elRef.value;
    let offsetTop = el.offsetTop || el.$el.offsetTop
    maxHeight.value = window.innerHeight - offsetTop;
  }
  return maxHeight;
};
