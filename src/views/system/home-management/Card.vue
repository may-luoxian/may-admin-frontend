<template>
  <div class="home-card h-64" :style="getWidth()">
    <header class="h-10 font-semibold flex items-center justify-between pr-4 pl-4 border-b dark:border-slate-700">
      <slot name="title">
        <span>未命名模块</span>
      </slot>
      <el-dropdown trigger="click" :disabled="editStatus" @command="handleControls">
        <SvgIcon name="configurate" class="float-right" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="edit">编辑</el-dropdown-item>
            <el-dropdown-item command="delete">删除</el-dropdown-item>
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
    <EditHomeDialog ref="editHomeDialogRef" @init="init" />
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/icon/src/SvgIcon.vue';
import EditHomeDialog from './EditHomeDialog.vue';
import { toRefs, inject, ref } from 'vue';
import { defHttp } from '@/utils/http/axios';
import { ElMessageBox } from 'element-plus';

interface Props {
  data: any;
  computeWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  width: 0,
  computeWidth: false,
});

const editStatus = inject('editStatus');
const init = inject('init') as (...args: any[]) => any;

const { computeWidth, data } = toRefs(props);

const editHomeDialogRef = ref();

const getWidth = () => {
  if (computeWidth.value) {
    return {
      'width': data.value.width + 'px',
    };
  } else {
    return {
      'width': '100%',
    };
  }
};

const handleControls = (command: string) => {
  if (command === 'edit') {
    editHomeDialogRef.value.open('edit', data.value);
  } else if (command === 'delete') {
    ElMessageBox.confirm('确定删除该模块？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
      .then(() => {
        defHttp
          .delete({
            url: '/admin/home/delete',
            data: {
              id: data.value.id,
            },
          })
          .then((res) => {
            if (res.code === 20000) {
              init();
            }
          });
      })
      .catch(() => {});
  }
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
