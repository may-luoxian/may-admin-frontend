<template>
  <div class="bg-style2">
    <el-header class="may-title">
      <span>首页管理</span>
    </el-header>
    <el-main class="may-container">
      <el-row :gutter="40">
        <el-col :span="18" class="relative">
          <EnableModels :enableList="enableList" @refreshStyle="refreshStyle" />
        </el-col>
        <el-col :span="6" class="relative">
          <NotEnableModels :notEnableList="notEnableList" />
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import EnableModels from './EnableModels.vue';
import NotEnableModels from './NotEnableModels.vue';
import { onMounted, reactive, toRefs } from 'vue';
import { defHttp } from '@/utils/http/axios';

interface HomeList {
  enableList: any[];
  notEnableList: any[];
}

let homeList = reactive<HomeList>({
  enableList: [],
  notEnableList: [],
});

const { enableList, notEnableList } = toRefs(homeList);

onMounted(() => {
  init();
});

const init = () => {
  getHomeList();
};

const getHomeList = () => {
  defHttp
    .get({
      url: '/homeList',
    })
    .then((res) => {
      const { enable, notEnable } = res.result.data;
      homeList.enableList = enable;
      homeList.notEnableList = notEnable;
    });
};

const refreshStyle = (data: any) => {
  homeList.enableList.map((item) => {
    if (item.id === data.id) {
      item.widthValue = data.command;
    }
  });
};
</script>

<style lang="scss" scoped></style>
