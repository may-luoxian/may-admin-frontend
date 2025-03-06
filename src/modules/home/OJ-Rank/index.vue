<!-- demo4 -->
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
      <el-radio-group v-model="showType" @change="handleChange">
        <el-radio-button value="1">图</el-radio-button>
        <el-radio-button value="2">表</el-radio-button>
      </el-radio-group>
      <div ref="echartRef" class="chart" v-if="showType === '1'"></div>
      <div v-else>
        <el-table :data="tableData" height="280">
          <el-table-column align="center" type="index" label="排名" width="80"></el-table-column>
          <el-table-column align="center" prop="nickname" label="昵称"></el-table-column>
          <el-table-column align="center" prop="acceptNum" label="通过数"></el-table-column>
          <el-table-column align="center" prop="submitNum" label="提交数"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/icon/src/SvgIcon.vue';
import { toRefs, ref, onMounted } from 'vue';
import { defHttp } from '@/utils/http/axios';
import { useDebounceFn, useResizeObserver, useFullscreen } from '@vueuse/core';
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
const containerRef = ref();

const { toggle } = useFullscreen(containerRef);

let showType = ref('1');
const dataSet = ref<any>([]);
const tableData = ref<any>([]);

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
      source: dataSet.value,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        interval: 0, // 强制显示所有标签
        // rotate: 20, // 通过旋转解决标签显示不下的问题
      },
    },
    yAxis: {},
    series: [{ type: 'bar' }, { type: 'bar' }],
  };
  mychart.setOption(option);
};

const getData = () => {
  defHttp
    .get({
      url: '/oj/statistic/rank',
    })
    .then((res) => {
      dataSet.value = res.data.map((item: any) => {
        return Object.values(item);
      });
      dataSet.value.unshift(['排名', '通过', '提交']);
      initEcharts(theme.value ? 'dark' : 'light');
      tableData.value = res.data;
      tableData.value;
    });
};

const handleChange = (value: string) => {
  if (value === '1') {
    initEcharts(theme.value ? 'dark' : 'light');
  }
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

.chart {
  @apply w-full;
  height: calc(100% - 32px);
}
</style>
