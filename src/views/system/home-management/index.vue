<template>
  <div class="bg-style2">
    <el-header class="may-title">
      <span>门户管理</span>
      <div class="float-right">
        <el-button class="mr-4" type="primary" :disabled="editStatus" @click="handleCreateHome">创建门户块</el-button>
        <el-tag class="mr-4" size="large">操作状态：{{ computedControls }}</el-tag>
        <el-select v-model="queryParams.roleId" class="mr-4" placeholder="请选择角色" clearable>
          <el-option v-for="item in roleList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="primary" @click="handlePreviewRole" :disabled="editStatus">预览角色门户</el-button>
        <el-tag class="mr-4" size="large" :closable="canClose" @close="handleCloseTag">当前预览用户：{{ currentPreView.username }}</el-tag>
        <el-button type="primary" @click="handlePreviewUser" :disabled="editStatus">预览用户门户</el-button>
        <el-button class="mr-4" type="primary" :loading="loading" @click="handleEditOrSave">{{ editStatus ? '保存' : '启用门户' }}</el-button>
      </div>
    </el-header>
    <main class="may-container">
      <el-row :gutter="40">
        <el-col :span="18" class="relative">
          <EnableModels ref="enableModelsRef" @refreshStyle="refreshStyle" @updateEnableModel="updateEnableModel" @enableModel="enableModel" />
        </el-col>
        <el-col :span="6" class="relative">
          <NotEnableModels :notEnableList="notEnableList" :isDisableNotEnableDrag="isDisableNotEnableDrag" @notEnableModel="notEnableModel" />
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
import { getRoles } from '@/api/system';

interface HomeList {
  enableList: any[];
  notEnableList: any[];
}

enum EditStatusEnum {
  USER_EDIT,
  USER_PREVIEW,
  ROLE_EDIT,
  ROLE_PREVIEW,
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
const roleList = ref();

const queryParams = reactive({
  roleId: null,
});

const controlStatus = ref<number>();

onMounted(() => {
  init();
});

/**
 * 初始化
 * 1.根据当前预览用户查询门户块，不存在预览用户则默认查询当前用户
 */
const init = () => {
  getRoleList();
  getHomeListByUser();
  controlStatus.value = EditStatusEnum.USER_PREVIEW;
};
provide('init', init);

const getRoleList = () => {
  getRoles().then((res) => {
    roleList.value = res.data.map((item: any) => {
      return {
        label: item.roleName,
        value: item.id,
      };
    });
  });
};

const getHomeListByUser = () => {
  defHttp
    .get({
      url: '/admin/home/listByUser',
      params: {
        userId: currentPreView.userInfoId,
      },
    })
    .then((res) => {
      const { enableList, notEnableList } = res.data;
      homeList.enableList = enableList;
      homeList.notEnableList = notEnableList;
      enableModelsRef.value.refreshList(homeList.enableList);
    });
};

const getHomeListByRole = () => {
  defHttp
    .get({
      url: '/admin/home/listByRole',
      params: {
        roleId: queryParams.roleId,
      },
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
    return item.id === Number(draggedId);
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

const handleCreateHome = () => {
  editHomeDialogRef.value.open('add');
};

const handleCloseTag = () => {
  currentPreView.username = userInfo.username;
  currentPreView.userInfoId = userInfo.userInfoId;
  removePreviewUser();
};

const handlePreviewUser = () => {
  getHomeListByUser();
  controlStatus.value = EditStatusEnum.USER_PREVIEW;
};

const handlePreviewRole = () => {
  getHomeListByRole();
  controlStatus.value = EditStatusEnum.ROLE_PREVIEW;
};

const handleEditOrSave = async () => {
  if (editStatus.value) {
    await saveHome();
  }
  editStatus.value = !editStatus.value;
  setControlStatus();
};

const saveHome = async () => {
  let enableData = enableList.value.map((item, index) => {
    return {
      homeId: item.id,
      orderNum: index + 1,
    };
  });
  let enableType = controlStatus.value === EditStatusEnum.USER_EDIT ? 'user' : 'role';
  let data = {};
  if (enableType == 'user') {
    data = {
      userInfoId: currentPreView.userInfoId,
      enableType,
      enableData,
    };
  } else {
    data = {
      roleId: queryParams.roleId,
      enableType,
      enableData,
    };
  }
  loading.value = true;
  try {
    const res = await defHttp.post({
      url: '/admin/home/enable',
      data,
    });
    console.log(res);
  } finally {
    loading.value = false;
  }
};

const setControlStatus = () => {
  if (editStatus.value && controlStatus.value === EditStatusEnum.ROLE_PREVIEW) {
    controlStatus.value = EditStatusEnum.ROLE_EDIT;
  } else if (editStatus.value && controlStatus.value === EditStatusEnum.USER_PREVIEW) {
    controlStatus.value = EditStatusEnum.USER_EDIT;
  } else if (!editStatus.value && controlStatus.value === EditStatusEnum.ROLE_EDIT) {
    controlStatus.value = EditStatusEnum.ROLE_PREVIEW;
  } else if (!editStatus.value && controlStatus.value === EditStatusEnum.USER_EDIT) {
    controlStatus.value = EditStatusEnum.USER_PREVIEW;
  }
};

const canClose = computed(() => currentPreView.userInfoId !== getUserInfo.userInfoId);

const computedControls = computed(() => {
  switch (controlStatus.value) {
    case EditStatusEnum.ROLE_EDIT:
      return '角色编辑';
    case EditStatusEnum.ROLE_PREVIEW:
      return '角色预览';
    case EditStatusEnum.USER_EDIT:
      return '用户编辑';
    case EditStatusEnum.USER_PREVIEW:
      return '用户预览';
    default:
      return '无';
  }
});

const isDisableNotEnableDrag = computed(() => controlStatus.value === EditStatusEnum.USER_EDIT);
</script>

<style lang="scss" scoped></style>
