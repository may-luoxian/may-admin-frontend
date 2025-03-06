<!-- 日历图 -->
<template>
  <!-- 容器 -->
  <div class="home-container rounded">
    <!-- 顶部工具栏 -->
    <div class="home-toolbar px-3 border-b border-default-c">
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
    <!-- 主体区域 -->
    <div class="home-main">
      <div ref="echartRef" class="h-72 w-full mt-5"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, onMounted, ref } from 'vue';
import { useDebounceFn, useResizeObserver } from '@vueuse/core';
import { defHttp } from '@/utils/http/axios';
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

const myDate = new Date();
const currentYear = myDate.getFullYear();

const echartRef = ref();
let mychart: any = null;

const dateList = ref([]);

const resize = () => {
  mychart?.resize({
    animation: {
      duration: 300,
      easing: 'quadraticIn',
    },
  });
};
const resizeHandler: () => void = useDebounceFn(resize, 200);
setTimeout(() => {
  useResizeObserver(echartRef as never, resizeHandler);
}, 2000);

onMounted(() => {
  initEcharts(theme.value ? 'dark' : 'light');
});

/**
 * 初始化Echarts
 */
const initEcharts = (theme: string = 'light') => {
  if (mychart) {
    mychart.dispose();
  }
  mychart = echarts.init(echartRef.value, theme);
  initOption();
  getData();
};

/**
 * 初始化日历图配置
 */
const initOption = () => {
  const option = {
    tooltip: {
      trigger: 'item',
      borderWidth: 0,
      formatter: (params: any) => {
        return `<div><b>${params.value[0]}</b> : ${params.value[1]}</div>`;
      },
    },
    visualMap: {
      type: 'piecewise',
      show: true,
      min: 0,
      textStyle: {
        color: theme.value ? '#cccccc' : '#000000',
      },
      pieces: getPiecesStyle(),
    },
    calendar: {
      range: currentYear,
      yearLabel: { show: true },
      cellSize: 30,
      left: 'center',
      top: '40px',
      dayLabel: {
        nameMap: 'ZH',
      },
      monthLabel: {
        nameMap: 'ZH',
      },
      splitLine: {
        show: false,
      },
      itemStyle: {
        borderWidth: 3,
      },
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: dateList.value,
    },
  };
  mychart.setOption(option);
};

const getData = () => {
  defHttp
    .get({
      url: `/oj/statistic/calendar/${currentYear}`,
    })
    .then((res) => {
      dateList.value = res.data.map((item: any) => {
        return [item.date, item.submitNum];
      });
      initOption();
    });
};

const getPiecesStyle = () => {
  return theme.value
    ? [
        { lte: 0, color: '#1d1e1f' },
        { gt: 0, lt: 10, color: '#ce8818' },
        { gte: 10, lt: 20, color: '#a87728' },
        { gte: 20, lt: 30, color: '#cfa157' },
        { gte: 30, color: '#dcb77b' },
      ]
    : [
        { lte: 0, color: '#eeeeee' },
        { gt: 0, lt: 10, color: '#d9e591' },
        { gte: 10, lt: 20, color: '#98c470' },
        { gte: 20, lt: 30, color: '#5ea14d' },
        { gte: 30, color: '#35662c' },
      ];
};

defineExpose({
  initEcharts,
  mychart,
});
</script>

<style lang="scss" scoped>
:deep(.el-divider) {
  @apply my-0;
  color: #ce8818;
}
</style>
