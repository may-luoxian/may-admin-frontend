<template>
  <div class="bg-style2">
    <el-header class="may-title">
      <span>门户管理</span>
      <div class="float-right">
        <el-button class="mr-4" type="primary" @click="handleCreateHome">创建门户块</el-button>
        <el-tag class="mr-4" size="large">编辑状态：用户</el-tag>
        <el-select class="mr-4" placeholder="请选择角色"></el-select>
        <el-button class="mr-4" type="primary" :loading="loading" @click="handleEditOrSave">{{ editStatus ? '保存' : '编辑角色门户块' }}</el-button>
        <el-tag class="mr-4" size="large" :closable="canClose" @close="handleCloseTag">当前预览用户：{{ currentPreView.username }}</el-tag>
        <el-button type="primary">预览当前用户门户块</el-button>
        <el-button type="primary">编辑当前用户门户块</el-button>
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
    <EditHomeDialog ref="editHomeDialogRef" @init="init" />
  </div>
</template>

<script setup lang="ts">
import EnableModels from './EnableModels.vue';
import NotEnableModels from './NotEnableModels.vue';
import EditHomeDialog from './EditHomeDialog.vue';
import { onMounted, reactive, toRefs, ref, provide, computed } from 'vue';
import { defHttp } from '@/utils/http/axios';
import { useUserStore } from '@/stores/modules/user';
import { useHomeStore } from '@/stores/modules/home';
import { isEmpty } from '@/utils/is';

interface HomeList {
  enableList: any[];
  notEnableList: any[];
}

const enableModelsRef = ref();
const editHomeDialogRef = ref();

let homeList = reactive<HomeList>({
  enableList: [],
  notEnableList: [],
});

const editStatus = ref<boolean>(false);
provide('editStatus', editStatus);

const loading = ref<boolean>(false);

const { enableList, notEnableList } = toRefs(homeList);

const { getUserInfo } = useUserStore();
const { getPreviewUser, removePreviewUser } = useHomeStore();

const userInfo = {
  username: getUserInfo.username,
  userInfoId: getUserInfo.userInfoId,
};
let currentPreView = reactive(isEmpty(getPreviewUser) ? userInfo : getPreviewUser);

onMounted(() => {
  init();
});

/**
 * 初始化
 * 1.根据当前预览用户查询门户块，不存在预览用户则默认查询当前用户
 */
const init = () => {
  getHomeList();
};
provide('init', init);

const getHomeList = () => {
  defHttp
    .get({
      url: '/admin/home/list',
    })
    .then((res) => {
      const { enableList, notEnableList } = res.data;
      homeList.enableList = enableList;
      homeList.notEnableList = notEnableList;
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

const handleCreateHome = () => {
  editHomeDialogRef.value.open('add');
};

const handleCloseTag = () => {
  currentPreView.username = userInfo.username;
  currentPreView.userInfoId = userInfo.userInfoId;
  removePreviewUser();
};

const canClose = computed(() => currentPreView.userInfoId !== getUserInfo.userInfoId);
</script>

<style lang="scss" scoped></style>
