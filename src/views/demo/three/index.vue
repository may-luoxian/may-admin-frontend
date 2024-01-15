<template>
  <div ref="threeMapRef" class="three-map" :style="{ height: mapHeight + 'px' }" v-resize="refreshRenderer"></div>
</template>

<script setup lang="ts">
import { useDomControlsHook } from '@/hooks/domControls';
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ChinaMap } from './chinaMap';
const threeMapRef = ref<any>();
const mapHeight = useDomControlsHook(threeMapRef);

let renderer: any = null; // 渲染器
let camera: any = null; // 相机
let scene: any = null; // 场景
let cameraControl = null; // 相机控件
let chinaMap: any = null;
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
  // 等待需要加载的模型、材质加载完毕后，加载渲染器
  initRenderer();
  // 初始化相机和渲染器后 添加相机控件
  initCameraControl();
  // 初始化地图
  initMap();
});

onBeforeUnmount(() => {
  chinaMap.destroyListener();
});

const initCamera = () => {
  // 初始相机
  camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
  camera.position.set(0, 120, 120);
  camera.lookAt(0, 0, 0);
};

const initRenderer = () => {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  renderer.render(scene, camera);
  threeMapRef.value.appendChild(renderer.domElement);
};

const initCameraControl = () => {
  cameraControl = new OrbitControls(camera, renderer.domElement);
  cameraControl.addEventListener('change', () => {
    renderer.render(scene, camera);
  });
};

const refreshRenderer = (info: any) => {
  width = info.width;
  height = info.height;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  chinaMap.setRaycaster(width, height, threeMapRef);
};

const initMap = () => {
  let options = {
    camera,
    renderer,
    scene,
    width,
    height,
    dom: threeMapRef,
  };
  chinaMap = new ChinaMap(options);
  chinaMap.init();
};
</script>

<style lang="scss" scoped>
.three-map {
  width: 100%;
}
</style>
