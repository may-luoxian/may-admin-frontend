<template>
  <el-dropdown class="h-full" popper-class="w-32 drowdown-class">
    <div class="flex items-center w-32 justify-evenly cursor-pointer hover:bg-slate-200 hover:dark:bg-slate-600">
      <img class="w-7 h-7 rounded-full" :src="avatar" alt="error" />
      <span class="text-sm">{{ getUserInfo.nickname }}</span>
    </div>
    <template #dropdown>
      <el-dropdown-item @click="handleLogout"><i class="iconfont el-icon-mytuichu"></i> 退出登录</el-dropdown-item>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { logout } from '@/api/system';
import { computed } from 'vue';
import router from '@/router';
import { useUserStore } from '@/stores/modules/user';

const userStore = useUserStore();
const { getUserInfo, clearOnlineStorage } = userStore;

const handleLogout = () => {
  logout(getUserInfo.id).then(() => {
    router.replace('/login');
    clearOnlineStorage();
  });
};

const avatar = computed(() => {
  return getUserInfo.avatar || '/src/assets/images/default-avatar.jpg';
});
</script>

<style lang="scss">
.drowdown-class {
  .el-dropdown-menu__item {
    padding: 6px 24px;
  }
}
</style>
