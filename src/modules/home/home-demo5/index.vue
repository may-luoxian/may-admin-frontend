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
      <div ref="echartRef" class="w-full h-full"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/icon/src/SvgIcon.vue';
import { toRefs, ref, onMounted } from 'vue';
import * as echarts from 'echarts';

interface Props {
  title: string;
  theme: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  theme: true,
});

const { title, theme } = toRefs(props);
const echartRef = ref();

onMounted(() => {
  initEcharts(theme.value ? 'dark' : 'light');
});

let mychart: any = null;
const initEcharts = (theme: string) => {
  if (mychart) {
    mychart.dispose();
  }
  mychart = echarts.init(echartRef.value, theme);
  const option = {
    legend: {
      top: 'bottom',
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    series: [
      {
        name: 'Nightingale Chart',
        type: 'pie',
        radius: [20, 120],
        center: ['50%', '40%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8,
        },
        data: [
          { value: 40, name: 'rose 1' },
          { value: 38, name: 'rose 2' },
          { value: 32, name: 'rose 3' },
          { value: 30, name: 'rose 4' },
          { value: 28, name: 'rose 5' },
          { value: 26, name: 'rose 6' },
          { value: 22, name: 'rose 7' },
          { value: 18, name: 'rose 8' },
        ],
      },
    ],
  };
  mychart.setOption(option);
};

defineExpose({
  initEcharts,
});
</script>

<style lang="scss" scoped>
:deep(.el-divider) {
  @apply my-0;
}
</style>
