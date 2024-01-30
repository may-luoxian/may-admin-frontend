<template>
  <div class="bg-style2">
    <el-header class="may-title">
      <span>首页管理</span>
      <div class="float-right">
        <el-button type="primary">创建模块</el-button>
        <el-button type="primary" :loading="loading" @click="handleEditOrSave">{{ editStatus ? '保存' : '编辑' }}</el-button>
      </div>
    </el-header>
    <main class="may-container">
      <el-row :gutter="40">
        <el-col :span="18" class="relative">
          <EnableModels ref="enableModelsRef" @refreshStyle="refreshStyle" @updateEnableModel="updateEnableModel" @enableModel="enableModel" />
        </el-col>
        <el-col :span="6" class="relative">
          <NotEnableModels :notEnableList="notEnableList" @notEnableModel="notEnableModel" />
        </el-col>
      </el-row>
    </main>
  </div>
</template>

<script setup lang="ts">
import EnableModels from './EnableModels.vue';
import NotEnableModels from './NotEnableModels.vue';
import { onMounted, reactive, toRefs, ref, provide } from 'vue';
import { defHttp } from '@/utils/http/axios';

interface HomeList {
  enableList: any[];
  notEnableList: any[];
}

const enableModelsRef = ref();

let homeList = reactive<HomeList>({
  enableList: [],
  notEnableList: [],
});

const editStatus = ref<boolean>(false);
provide('editStatus', editStatus);

const loading = ref<boolean>(false);

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
      enableModelsRef.value.refreshList(homeList.enableList);
    });
};

const enableModel = (evt: any) => {
  const changeData = notEnableList.value.splice(evt.oldIndex, 1);
  enableList.value.splice(evt.newIndex, 0, changeData[0]);
  enableModelsRef.value.refreshList(homeList.enableList);
};

const updateEnableModel = (models: any) => {
  let currentIndex = enableList.value.findIndex((item) => {
    return item.id === models.current;
  });
  let newIndex = enableList.value.findIndex((item) => {
    return item.id === models.related;
  });
  const changeData = enableList.value.splice(currentIndex, 1);
  enableList.value.splice(newIndex, 0, changeData[0]);
  enableModelsRef.value.refreshList(enableList.value);
};

const notEnableModel = (evt: any) => {
  let draggedId = evt.item.dataset.id;
  let draggedIndex = enableList.value.findIndex((item) => {
    return item.id === draggedId;
  });
  const changeData = enableList.value.splice(draggedIndex, 1);
  notEnableList.value.splice(evt.newIndex, 0, changeData[0]);
  enableModelsRef.value.refreshList(enableList.value);
};

const refreshStyle = (data: any) => {
  homeList.enableList.map((item) => {
    if (item.id === data.id) {
      item.widthValue = data.command;
    }
  });
  enableModelsRef.value.refreshList(enableList.value);
};

const handleEditOrSave = () => {
  loading.value = true;
  setTimeout(() => {
    editStatus.value = !editStatus.value;
    loading.value = false;
  }, 1000);
};
</script>

<style lang="scss" scoped></style>
