<template>
  <div>
    <el-header class="may-title">
      <span>SSE</span>
    </el-header>
    <!-- <el-main>
      <div class="border-solid border-2 border-indigo-600 w-2/5 h-96 mb-2 overflow-auto">
        <div v-for="item in data" :key="item">{{ item }}</div>
      </div>
      <el-button @click="init">初始化</el-button>
      <el-button type="primary" @click="handleConnectSSE" :disabled="isConnection">{{ isConnection ? '已连接' : '建立连接' }}</el-button>
      <el-button type="danger" @click="handleCloseSSE">断开连接</el-button>
    </el-main> -->
    <el-cascader v-model="selectedData" :options="data" :props="props" :show-all-levels="false" @change="handleChange"></el-cascader>
  </div>
</template>

<script setup lang="ts">
import { defHttp } from '@/utils/http/axios';
import { onMounted, reactive, toRefs } from 'vue';
// let SSEConnection = ref<EventSource>();
// let isConnection = ref<boolean>(false);
let sseData = reactive<any>({
  data: [],
  selectedData: [],
});
let { data, selectedData } = toRefs(sseData);

// const lazyLoad =

let props = {
  lazy: true,
  lazyLoad: (node: any, resolve: any) => {
    console.log(node)
    defHttp
      .get({
        url: '/lazyload',
        params: {
          value: node.data.value,
        },
      })
      .then((res) => {
        resolve(res.result.data);
      });
  },
};

onMounted(() => {
  init();
});

const getFormData = () => {
  setTimeout(() => {
    sseData.selectedData = ['component', 'basic'];
  });
};

const init = () => {
  getData();
  getFormData();
};

const getData = () => {
  defHttp
    .get({
      url: '/cascader',
    })
    .then((res) => {
      sseData.data = res.result.data;
    });
};

const handleChange = (e: any) => {
  console.log(e);
};

// const init = () => {
//   sseData.data = [];
//   handleCloseSSE();
// };

// const handleConnectSSE = () => {
//   if ('EventSource' in window) {
//     // 创建EventSource实例
//     SSEConnection.value = new EventSource('http://localhost:8080/sse');
//     // 监听事件
//     SSEConnection.value.onopen = () => {
//       // 连接建立
//       if (SSEConnection.value?.readyState === SSEConnection.value?.OPEN) {
//         isConnection.value = true;
//       }
//     };
//     SSEConnection.value.onmessage = (event) => {
//       sseData.data.push(JSON.parse(event.data));
//     };
//   } else {
//     console.warn('浏览器版本过低');
//   }
// };
// const handleCloseSSE = () => {
//   // 处理断开连接
//   SSEConnection.value?.close();
//   isConnection.value = false;
// };
</script>

<style lang="scss" scoped></style>
