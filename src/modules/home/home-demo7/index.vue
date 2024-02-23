<!-- demo4 -->
<template>
  <!-- 容器 -->
  <div class="home-container rounded">
    <!-- 顶部工具栏 -->
    <div class="home-toolbar px-3">
      <span class="panel-title-standard">{{ title }}</span>
      <div class="float-right">
        <!-- 操作按钮 -->
        <el-dropdown trigger="hover" style="vertical-align: baseline">
          <SvgIcon name="configurate" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="refresh"><i class="el-icon-refresh pr10"></i>刷新</el-dropdown-item>
              <el-dropdown-item command="modify"><i class="el-icon-edit pr10"></i>编辑</el-dropdown-item>
              <el-dropdown-item command="remove"><i class="el-icon-delete pr10"></i>删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <el-divider></el-divider>
    <!-- 主体区域 -->
    <div class="home-main">
      <div><span class="float-left mr-2">通过率：</span><el-progress :percentage="50" :text-inside="true" :stroke-width="26" /></div>
      <div><span class="float-left mr-2">通过率：</span><el-progress :percentage="100" :text-inside="true" :stroke-width="26" :format="format" /></div>
      <div><span class="float-left mr-2">通过率： </span><el-progress :percentage="100" :text-inside="true" :stroke-width="26" status="success" /></div>
      <div><span class="float-left mr-2">通过率：</span><el-progress :percentage="100" :text-inside="true" :stroke-width="26" status="warning" /></div>
      <div><span class="float-left mr-2">通过率：</span><el-progress :percentage="50" :text-inside="true" :stroke-width="26" status="exception" /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/icon/src/SvgIcon.vue';
import { toRefs } from 'vue';

interface Props {
  title: string;
  theme: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
});

const { title } = toRefs(props);

const format = (percentage) => (percentage === 100 ? 'Full' : `${percentage}%`);
</script>

<style lang="scss" scoped>
:deep(.el-divider) {
  @apply my-0;
}
.el-progress--line {
  margin-top: 15px;
  margin-bottom: 25px;
  width: 90%;
}
</style>
