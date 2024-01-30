<template>
  <div class="home-card h-64" :style="getWidth()">
    <header class="h-10 font-semibold flex items-center justify-between pr-4 pl-4 border-b dark:border-slate-700">
      <slot name="title">
        <span>未命名模块</span>
      </slot>
      <el-dropdown trigger="click" v-if="editStatus" @command="handleChangeStyle">
        <SvgIcon name="configurate" class="float-right" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in CARD_WIDTH" :key="item.value" :command="item.value">{{ item.label }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </header>
    <div class="p-4 h-52">
      <div class="h-full flex justify-center items-center" v-if="editStatus">
        <SvgIcon class="dragged cursor-pointer" name="drag" size="24" />
      </div>
      <slot name="content" v-else>
        <ob-skeleton :count="4" height="2.25rem" width="100%" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/icon/src/SvgIcon.vue';
import { toRefs, inject } from 'vue';
import { CARD_WIDTH } from '@/views/constant/systemConstant';

interface Props {
  id?: string | number;
  width?: number;
  computeWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  width: 0,
  computeWidth: false,
});

const editStatus = inject('editStatus');

const emit = defineEmits(['refreshStyle']);

const { width, computeWidth, id } = toRefs(props);

const getWidth = () => {
  if (computeWidth.value) {
    return {
      'width': width.value + 'px',
    };
  } else {
    return {
      'width': '100%',
    };
  }
};

const handleChangeStyle = (command: number) => {
  emit('refreshStyle', {
    id: id.value,
    command,
  });
};
</script>

<style lang="scss" scoped>
.home-card {
  background-color: var(--default-card-bgcolor);
  @apply rounded-md;
}

:deep(.el-dropdown-menu__item) {
  justify-content: center;
}
</style>
