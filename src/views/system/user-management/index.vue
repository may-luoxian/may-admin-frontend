<template>
  <el-header class="may-title"> 角色管理 </el-header>
  <el-main class="may-container">
    <div class="flex gap-x-10">
      <div ref="roleRef" class="basis-2/5 h-full border-slate-200 border-2 rounded border-solid">
        <div class="may-title px-4">角色列表</div>
        <el-table ref="roleTableRef" :data="roleList" :height="roleMaxHeight - 100" size="large" border>
          <el-table-column type="selection" width="55" />
          <el-table-column label="角色名" prop="roleName" align="center" min-width="100"></el-table-column>
          <el-table-column label="是否禁用" prop="isDisable" align="center" min-width="80"></el-table-column>
          <el-table-column label="创建时间" prop="createTime" align="center" min-width="140"></el-table-column>
        </el-table>
        <div class="float-right p-2">
          <el-pagination
            v-model:current-page="page.current"
            v-model:page-size="page.size"
            :page-sizes="[10, 20]"
            :total="total"
            background
            layout="total, sizes, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      <div ref="resourceRef" class="basis-3/5 h-full border-slate-200 border-2 rounded border-solid" :style="{ height: resourceMaxHeight - 50 + 'px' }"></div>
    </div>
  </el-main>
</template>

<script setup lang="ts">
import api from '@/api/api';
import { useDomControlsHook } from '@/hooks/domControls';
import { ref, onMounted, reactive, toRefs } from 'vue';

const roleTableRef = ref<any>();
const resourceRef = ref<any>();
const roleMaxHeight = useDomControlsHook(roleTableRef);
const resourceMaxHeight = useDomControlsHook(resourceRef);
let rolesParams = reactive({
  page: {
    current: 0,
    size: 10,
    keywords: '',
  },
});
let { page } = toRefs(rolesParams);
let roleData = reactive({
  roleList: [],
  total: 0,
});
let { roleList, total } = toRefs(roleData);

onMounted(() => {
  init();
});

const init = () => {
  getRoleList();
};

const getRoleList = () => {
  api.getRoles(rolesParams.page).then((res) => {
    roleData.roleList = res.data.records;
    roleData.total = res.data.count;
    console.log(roleData.roleList);
  });
};

const handleSizeChange = () => {};
const handleCurrentChange = () => {};
</script>

<style lang="scss" scope></style>
