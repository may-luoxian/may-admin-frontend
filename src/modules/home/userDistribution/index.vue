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
      <div>
        <el-radio-group v-model="type" @change="handleChange">
          <el-radio-button :value="1">用户</el-radio-button>
          <el-radio-button :value="2">游客</el-radio-button>
        </el-radio-group>
      </div>
      <div class="chart" ref="echartRef"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/icon/src/SvgIcon.vue';
import * as echarts from 'echarts';
import { ref, onMounted, toRefs } from 'vue';
import { useDebounceFn, useResizeObserver, useFullscreen } from '@vueuse/core';
import { defHttp } from '@/utils/http/axios';
import loadMap from '@/assets/json/china.js';

loadMap({}, echarts);

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
const { toggle, isFullscreen } = useFullscreen(containerRef);
const { title, theme } = toRefs(props);
const userAreaMap = ref();
const type = ref(1);

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
  listUserArea();
});

let mychart: any = null;
const initEcharts = (theme: string) => {
  if (mychart) {
    mychart.dispose();
  }
  mychart = echarts.init(echartRef.value, theme);
  const option = {
    tooltip: {
      formatter: function (e: any) {
        var value = e.value ? e.value : 0;
        return e.seriesName + '<br />' + e.name + '：' + value;
      },
    },
    visualMap: {
      min: 0,
      max: 1000,
      right: 26,
      bottom: 40,
      showLabel: !0,
      textStyle: {
        color: theme === 'light' ? '#000000' : '#cccccc',
      },
      pieces: [
        {
          gt: 100,
          label: '100人以上',
          color: '#ED5351',
        },
        {
          gte: 51,
          lte: 100,
          label: '51-100人',
          color: '#59D9A5',
        },
        {
          gte: 21,
          lte: 50,
          label: '21-50人',
          color: '#F6C021',
        },
        {
          label: '1-20人',
          gt: 0,
          lte: 20,
          color: '#6DCAEC',
        },
      ],
      show: !0,
    },
    geo: {
      map: 'china',
      zoom: 1.2,
      layoutCenter: ['50%', '50%'],
      itemStyle: {
        normal: {
          borderColor: theme === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)',
          areaColor: theme === 'light' ? '#dddddd' : '#2d3033',
        },
        emphasis: {
          areaColor: theme === 'light' ? '#F5DEB3' : '#427190',
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          borderWidth: 0,
        },
      },
    },
    series: [
      {
        name: '用户人数',
        type: 'map',
        geoIndex: 0,
        data: userAreaMap.value,
        areaColor: '#0FB8F0',
      },
    ],
  };
  mychart.setOption(option);
};

const listUserArea = () => {
  defHttp
    .get({
      url: '/management-center/users/area',
      params: {
        type: type.value,
      },
    })
    .then((res) => {
      userAreaMap.value = res.data;
      initEcharts(theme.value ? 'dark' : 'light');
    });
};

const handleChange = () => {
  listUserArea();
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
