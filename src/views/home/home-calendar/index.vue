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
    <div class="home-main">
      <el-dropdown class="mr-2 float-right" @command="handleCommand">
        <span class="el-dropdown-link">
          {{ currentYear }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in yearList" :key="item" :command="item">{{ item }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div ref="echartRef" class="h-72 w-full mt-5"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, onMounted, ref } from 'vue';
import SvgIcon from '@/components/icon/src/SvgIcon.vue';
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

const yearList = ref(['2021', '2022', '2023', '2024']);

const myDate = new Date();

const currentYear = ref(String(myDate.getFullYear()));
const echartRef = ref();
let echart: any = null;

onMounted(() => {
  initEcharts(theme.value ? 'dark' : 'light');
});

/**
 * 初始化Echarts
 */
const initEcharts = (theme: string = 'light') => {
  if (echart) {
    echart.dispose();
  }
  echart = echarts.init(echartRef.value, theme);
  initOption();
};

/**
 * 初始化日历图配置
 */
const initOption = () => {
  const option = {
    visualMap: {
      type: 'piecewise',
      show: false,
      min: 0,
      pieces: [
        { lte: 0, color: '#eeeeee' },
        { gt: 0, lt: 10, color: '#d9e591' },
        { gte: 10, lt: 20, color: '#98c470' },
        { gte: 20, lt: 30, color: '#5ea14d' },
        { gte: 30, color: '#35662c' },
      ],
    },
    calendar: {
      range: currentYear.value,
      yearLabel: { show: false },
      cellSize: 25,
      left: 'center',
      dayLabel: {
        color: theme.value ? '#ffffff' : '#000000',
        nameMap: 'ZH',
      },
      monthLabel: {
        color: theme.value ? '#ffffff' : '#000000',
        nameMap: 'ZH',
      },
      splitLine: {
        show: false,
      },
      itemStyle: {
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: getVirtualData(currentYear.value),
    },
  };
  echart.setOption(option);
};

const getVirtualData = (year: string) => {
  const date = +echarts.time.parse(year + '-01-01');
  const end = +echarts.time.parse(year + '-12-31');
  const dayTime = 3600 * 24 * 1000;
  const data = [];
  for (let time = date; time <= end; time += dayTime) {
    data.push([echarts.time.format(time, '{yyyy}-{MM}-{dd}', false), Math.floor(Math.random() * 30)]);
  }
  return data;
};

const handleCommand = (year: string) => {
  currentYear.value = year;
  initOption();
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
