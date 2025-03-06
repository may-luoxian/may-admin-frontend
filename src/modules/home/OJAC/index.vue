<!-- demo1 -->
<template>
  <!-- 容器 -->
  <div ref="containerRef" class="home-container rounded">
    <!-- 顶部工具栏 -->
    <div class="home-toolbar px-3 border-b border-default-c">
      <span class="panel-title-standard">{{ title }}</span>
      <div class="float-right">
        <!-- 操作按钮 -->
        <el-icon class="mt-1 mr-3" @click="handleFullScreen"><FullScreen /></el-icon>
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
      <div class="w-full h-full" ref="echartRef"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/icon/src/SvgIcon.vue';
import { defHttp } from '@/utils/http/axios';
import * as echarts from 'echarts';
import { ref, onMounted, toRefs } from 'vue';
import { useDebounceFn, useResizeObserver, useFullscreen } from '@vueuse/core';

const echartRef = ref();
const containerRef = ref();

interface Props {
  title: string;
  theme: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  theme: true,
});

const { title, theme } = toRefs(props);

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
  getData();
});

const { toggle } = useFullscreen(containerRef);

let mychart: any = null;
let option = {};

let acceptList = ref([]);
let sumList = ref([]);
let dateList = ref([]);

const getData = () => {
  defHttp
    .get({
      url: '/oj/statistic/ac',
    })
    .then((res) => {
      acceptList.value = res.data.map((item: any) => {
        return item.accept;
      });
      sumList.value = res.data.map((item: any) => {
        return item.sum;
      });
      dateList.value = res.data.map((item: any) => {
        return item.createTime;
      });
      initEcharts(theme.value ? 'dark' : 'light');
    });
};

/**
 * 初始化chart
 */
const initEcharts = (theme: string) => {
  if (mychart) {
    mychart.dispose();
  }
  mychart = echarts.init(echartRef.value, theme);
  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: {
      data: ['通过数', '提交数'],
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: dateList.value,
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: '通过数',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        smooth: false,
        data: acceptList.value,
      },
      {
        name: '提交数',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        smooth: false,
        data: sumList.value,
      },
    ],
  };
  mychart.setOption(option);
};

const handleFullScreen = () => {
  toggle();
};

defineExpose({
  initEcharts,
  mychart,
});
</script>

<style lang="scss" scoped>
:deep(.el-divider) {
  @apply my-0;
}
</style>
