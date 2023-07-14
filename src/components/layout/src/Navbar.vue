<template>
  <div class="w-full">
    <div class="flex items-center h-12">
      <div class="cursor-pointer h-full flex items-center mr-4">
        <SvgIcon :name="isFold" size="22" @click="toggleMenu" />
      </div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="item in breadcrumb">{{ item.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SvgIcon } from "@/components/icon";
import { useMenuStore } from "@/stores/menu";
import { ref, computed, onMounted } from "vue";
import { useRoute, onBeforeRouteUpdate, type RouteRecord, type RouteRecordNormalized } from "vue-router";
import type { Breadcrumb } from '@/components/layout/index'

const props = defineProps<{
  isCollapse: boolean
}>()

const route = useRoute();
let breadcrumb = ref<Breadcrumb[]>([])
onMounted(() => {
  getMatched(route.matched)
})
onBeforeRouteUpdate((to) => {
  getMatched(to.matched)
})
function getMatched(currentMatched: RouteRecordNormalized[]) {
  let matched = currentMatched.map((item: RouteRecordNormalized) => {
    return {
      path: item.path,
      name: item.name,
      meta: item.meta
    }
  })
  breadcrumb.value = matched.splice(1)
}

const isFold = computed(() => props.isCollapse ? 'menu-expand' : 'menu-fold')

const toggleMenu = function () {
  const menuStore = useMenuStore()
  menuStore.toggleMenu()
}
</script>

<style lang="scss" scoped></style>
