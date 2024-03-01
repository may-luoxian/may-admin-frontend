<template>
  <div class="not-enable-modules h-full">
    <div class="text-lg font-bold w-full">未启用</div>
    <div ref="notEnableRef" class="not-enable-content overflow-auto list-box relative">
      <Card class="mb-4 card" v-for="item in notEnableList" :key="item.id" :data-id="item.id" :data="item">
        <template #title>
          <span>{{ item.name }}</span>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from '@/modules/system/home-management/Card.vue';
import { ref, toRefs, onMounted, watch } from 'vue';
import Sortable from 'sortablejs';
import emitter from '@/utils/mitt';

const notEnableRef = ref();

interface Props {
  notEnableList: any[];
  isDisableNotEnableDrag: boolean;
}

const emit = defineEmits(['notEnableModel']);

const props = withDefaults(defineProps<Props>(), {
  notEnableList: () => [],
  isDisableNotEnableDrag: false,
});

const { notEnableList, isDisableNotEnableDrag } = toRefs(props);

const sortable = ref();

watch(isDisableNotEnableDrag, (newVal: boolean) => {
  sortable.value.option('disabled', newVal);
});

const createSortable = () => {
  sortable.value = new Sortable(notEnableRef.value, {
    group: 'shared',
    animation: 150,
    disabled: isDisableNotEnableDrag.value,
    draggable: '.card',
    handle: '.dragged',
    scroll: true,
    onAdd,
    onMove,
  });
};

onMounted(() => {
  createSortable();
});

const onAdd = (evt: any) => {
  emit('notEnableModel', evt);
};

const onMove = (evt: any) => {
  if (evt.to === notEnableRef.value) {
    setStyleToNotEnable(evt.dragged);
    emitter.emit('clearEnableBorder');
  } else {
    emitter.emit('dragToEnable', evt);
  }
};

emitter.on('dragToNotEnable', (evt: any) => {
  setStyleToNotEnable(evt.dragged);
});

const setStyleToNotEnable = (dom: any) => {
  dom.style.top = 'auto';
  dom.style.left = 'auto';
  dom.style.width = '100%';
  dom.style.opacity = 1;
  dom.style.position = 'static';
  dom.style.marginBottom = '16px';
};
</script>

<style lang="scss" scoped>
.not-enable-content {
  height: calc(100% - 32px);
}
</style>
