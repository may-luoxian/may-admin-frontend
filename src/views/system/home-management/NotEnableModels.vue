<template>
  <div class="not-enable-modules">
    <div class="text-lg font-bold w-full">未启用</div>
    <div ref="notEnableRef" class="overflow-auto list-box" :style="{ 'height': notEnableHeight - 240 + 'px' }">
      <Card class="mb-4" v-for="item in notEnableList" :key="item.id">
        <template #title>
          <span>{{ item.name }}</span>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from '@/views/components/Card.vue';
import { ref, toRefs } from 'vue';
import { useDomControlsHook } from '@/hooks/domControls';

const notEnableRef = ref();
let notEnableHeight = useDomControlsHook(notEnableRef) || 0;

interface Props {
  notEnableList: any[];
}

const props = withDefaults(defineProps<Props>(), {
  notEnableList: () => [],
});

const { notEnableList } = toRefs(props);
</script>

<style lang="scss" scoped></style>
