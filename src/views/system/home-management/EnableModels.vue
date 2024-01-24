<template>
  <div class="enable-modules">
    <div class="text-lg font-bold w-full">启用</div>
    <div ref="enableRef" class="overflow-auto list-box relative" :style="{ 'height': enableHeight - 240 + 'px' }">
      <Card
        class="absolute"
        v-for="item in hasPositionList"
        :key="item.id"
        :id="item.id"
        :width="item.width"
        :computeWidth="true"
        :style="{ 'top': item.top + 'px', 'left': item.left + 'px' }"
        @refreshStyle="refreshStyle"
      >
        <template #title>
          <span>{{ item.name }}</span>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from '@/views/components/Card.vue';
import { toRefs, ref, watch } from 'vue';
import { useDomControlsHook } from '@/hooks/domControls';
import { absoluteElPosition } from '@/utils';
import { isEmpty } from '@/utils/is';

const enableRef = ref();
let enableHeight = useDomControlsHook(enableRef) || 0;

interface Props {
  enableList: any[];
}

const props = withDefaults(defineProps<Props>(), {
  enableList: () => [],
});

const emit = defineEmits(['refreshStyle']);

const { enableList } = toRefs(props);

const hasPositionList = ref<any[]>([]);

watch(
  enableList,
  (newVal) => {
    if (isEmpty(newVal)) {
      hasPositionList.value = [];
    }
    let dataList = absoluteElPosition(newVal, enableRef.value, 256, 10, 16);
    hasPositionList.value = dataList;
  },
  {
    deep: true,
  }
);

const refreshStyle = (data: any) => {
  emit('refreshStyle', data);
};
</script>

<style lang="scss" scoped></style>
