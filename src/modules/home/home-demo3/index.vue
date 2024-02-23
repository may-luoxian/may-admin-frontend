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
  theme: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  theme: true,
});

const { title, theme } = toRefs(props);

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
    legend: {},
    tooltip: {},
    dataset: {
      source: [
        ['product', '2015', '2016', '2017'],
        ['Matcha Latte', 43.3, 85.8, 93.7],
        ['Milk Tea', 83.1, 73.4, 55.1],
        ['Cheese Cocoa', 86.4, 65.2, 82.5],
        ['Walnut Brownie', 72.4, 53.9, 39.1],
      ],
    },
    xAxis: { type: 'category' },
    yAxis: {},
    series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }],
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
