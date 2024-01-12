<template>
  <div ref="threeMapRef" class="three-map" :style="{ height: mapHeight + 'px' }" v-resize="refreshRenderer"></div>
</template>

<script setup lang="ts">
import { useDomControlsHook } from '@/hooks/domControls';
import { ref, onMounted, nextTick } from 'vue';
import * as THREE from 'three';
const threeMapRef = ref<any>();
const mapHeight = useDomControlsHook(threeMapRef);

let renderer: any = null; // 渲染器
let camera: any = null; // 相机
let scene: any = null; // 场景
let width = 0;
let height = 0;

onMounted(async () => {
  await nextTick(); // 此处需要useDomControlsHook内部处理完成后再获取宽高
  width = threeMapRef.value.offsetWidth;
  height = threeMapRef.value.offsetHeight;
  scene = new THREE.Scene();
  const axesHelper = new THREE.AxesHelper(150);
  scene.add(axesHelper);
  initCamera();
  initRenderer();
});

const initCamera = () => {
  camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
  camera.position.set(200, 200, 200);
  camera.lookAt(0, 0, 0);
};

const initRenderer = () => {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  renderer.render(scene, camera);
  threeMapRef.value.appendChild(renderer.domElement);
};

const refreshRenderer = (info: any) => {
  width = info.width;
  height = info.height;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
};
</script>

<style lang="scss" scoped>
.three-map {
  width: 100%;
}
</style>
