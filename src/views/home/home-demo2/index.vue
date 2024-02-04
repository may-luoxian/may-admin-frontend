<!-- demo1 -->
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
      <div class="w-full h-full" ref="echartRef"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/icon/src/SvgIcon.vue';
import * as echarts from 'echarts';
import { ref, onMounted, toRefs } from 'vue';

const echartRef = ref();

interface Props {
  title: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
});

const { title } = toRefs(props);

onMounted(() => {
  init();
});

/**
 * 初始化chart
 */
const init = () => {
  const mychart = echarts.init(echartRef.value);
  const option = {
    title: [
      {
        text: 'Radial Polar Bar Label Position (middle)',
      },
    ],
    polar: {
      radius: [30, '80%'],
    },
    radiusAxis: {
      max: 4,
    },
    angleAxis: {
      type: 'category',
      data: ['a', 'b', 'c', 'd'],
      startAngle: 75,
    },
    tooltip: {},
    series: {
      type: 'bar',
      data: [2, 1.2, 2.4, 3.6],
      coordinateSystem: 'polar',
      label: {
        show: true,
        position: 'middle',
        formatter: '{b}: {c}',
      },
    },
  };
  mychart.setOption(option);
};
</script>

<style lang="scss" scoped>
:deep(.el-divider) {
  @apply my-0;
}
</style>
