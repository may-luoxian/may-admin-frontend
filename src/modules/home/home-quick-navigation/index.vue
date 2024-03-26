<!-- 日历图 -->
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
    <div class="home-main flex flex-wrap"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

interface Props {
  title: string;
  theme: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  theme: true,
});

onMounted(() => {});
</script>

<style lang="scss" scoped>
:deep(.el-divider) {
  @apply my-0;
  color: #ce8818;
}

.home-main {
  @apply p-0 overflow-auto;
}

.test {
  flex: 180px 1 0;
  height: 180px;
}
</style>
