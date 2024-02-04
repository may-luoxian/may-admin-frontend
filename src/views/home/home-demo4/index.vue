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
import 'echarts-gl';

interface Props {
  title: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
});

const { title } = toRefs(props);
const echartRef = ref();

onMounted(() => {
  init();
});

const init = () => {
  const myChart = echarts.init(echartRef.value);
  var data: any = [];
  // Parametric curve
  for (var t = 0; t < 25; t += 0.001) {
    var x = (1 + 0.25 * Math.cos(75 * t)) * Math.cos(t);
    var y = (1 + 0.25 * Math.cos(75 * t)) * Math.sin(t);
    var z = t + 2.0 * Math.sin(75 * t);
    data.push([x, y, z]);
  }
  console.log(data.length);
  const option = {
    tooltip: {},
    visualMap: {
      show: false,
      dimension: 2,
      min: 0,
      max: 30,
      inRange: {
        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
      },
    },
    xAxis3D: {
      type: 'value',
    },
    yAxis3D: {
      type: 'value',
    },
    zAxis3D: {
      type: 'value',
    },
    grid3D: {
      viewControl: {
        projection: 'orthographic',
      },
    },
    series: [
      {
        type: 'line3D',
        data: data,
        lineStyle: {
          width: 4,
        },
      },
    ],
  };
  myChart.setOption(option);
};
</script>

<style lang="scss" scoped>
:deep(.el-divider) {
  @apply my-0;
}
</style>
