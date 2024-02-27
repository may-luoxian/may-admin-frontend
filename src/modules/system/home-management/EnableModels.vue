<template>
  <div class="enable-modules">
    <div class="text-xl font-bold w-full">
      <span>启用</span>
    </div>
    <div ref="enableRef" class="overflow-auto list-box relative rounded transition-all" :style="{ 'height': enableHeight - 240 + 'px' }">
      <Card class="absolute card transition-all" v-for="item in hasPositionList" :key="item.id" :data-id="item.id" :data="item" :computeWidth="true" :style="{ 'top': item.top + 'px', 'left': item.left + 'px' }" @refreshStyle="refreshStyle">
        <template #title>
          <span>{{ item.name }}</span>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from '@/modules/system/home-management/Card.vue';
import { ref, onMounted } from 'vue';
import { useDomControlsHook } from '@/hooks/domControls';
import { absoluteElPosition } from '@/utils';
import Sortable from 'sortablejs';
import emitter from '@/utils/mitt';

const enableRef = ref();
let enableHeight = useDomControlsHook(enableRef) || 0;

const sortable = ref();

const emit = defineEmits(['refreshStyle', 'moveByNotEnable', 'updateEnableModel', 'enableModel']);

const hasPositionList = ref<any[]>([]);

onMounted(() => {
  createSortable();
});

const createSortable = () => {
  sortable.value = new Sortable(enableRef.value, {
    group: 'shared',
    animation: 150,
    draggable: '.card',
    handle: '.dragged',
    scroll: true,
    onAdd,
    onMove,
  });
};

const refreshList = (data: any) => {
  let dataList = absoluteElPosition(data, enableRef.value, 256, 10, 16);
  hasPositionList.value = dataList;
};

const refreshStyle = (data: any) => {
  emit('refreshStyle', data);
};

const onAdd = (evt: any) => {
  emit('enableModel', evt);
  clearEnableBorder();
};

const onMove = (evt: any) => {
  if (evt.to === enableRef.value) {
    setStyleToEnable(evt.dragged);
    const models = {
      current: Number(evt.dragged.dataset.id),
      related: Number(evt.related.dataset.id),
    };
    emit('updateEnableModel', models);
  } else {
    emitter.emit('dragToNotEnable', evt);
  }
};

const setStyleToEnable = (dom: any) => {
  dom.style.position = 'absolute';
  dom.style.marginBottom = 0;
};

emitter.on('dragToEnable', (evt: any) => {
  if (evt.to === enableRef.value) {
    evt.dragged.style.opacity = 0;
    enableRef.value.style.border = '1px dashed #409EFF';
    setStyleToEnable(evt.dragged);
  } else {
    clearEnableBorder();
  }
});

emitter.on('clearEnableBorder', () => {
  clearEnableBorder();
});

const clearEnableBorder = () => {
  if (enableRef.value) {
    enableRef.value.style.border = 'none';
  }
};

defineExpose({
  refreshList,
});
</script>

<style lang="scss" scoped></style>
