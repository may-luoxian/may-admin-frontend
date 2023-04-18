<template>
  <div class="h-full">
    <el-container class="h-full">
      <el-aside width="auto">
        <Sidebar />
      </el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Sidebar, Navbar } from '@/components/layout';
</script>

<style lang="scss" scoped></style>
