<template>
  <div class="h-full">
    <div id="map-container" class="h-full"></div>
    <div>
      <el-button @click="handleToTiananmen">到北京天安门</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Map, View } from 'ol';
import { ZoomToExtent, ZoomSlider, FullScreen } from 'ol/control';
import { toStringHDMS } from 'ol/coordinate';
import { transform, toLonLat, fromLonLat } from 'ol/proj';
import { XYZ } from 'ol/source';
import { Tile } from 'ol/layer';
import Overlay from 'ol/Overlay';
import initBaiduMap from './js/baidu';
import { createVNode, onMounted, render } from 'vue';
import testDialog from './testDialog.vue';

// 高德地图
const mapLayer = new Tile({
  source: new XYZ({
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
    wrapX: false,
  }),
});

// 百度地图路网
// let mapLayer = initBaiduMap();
let overlay: Overlay | null = null;

let map: Map | null = null;

onMounted(() => {
  initMap();
  loadMapControls();
});

/**
 * 初始化地图
 */
const initMap = () => {
  // 初始化openlayers地图
  map = new Map({
    layers: [mapLayer], // 设置图层
    view: new View({
      projection: 'EPSG:4326',
      center: [116.396944, 39.915833], //地图初始中心点
      zoom: 18,
      minZoom: 5,
      maxZoom: 30,
    }),
    target: 'map-container',
  });

  // 创建地图事件
  map.on('singleclick', handleSingleClick);
};

/**
 * 加载地图控件
 */
const loadMapControls = () => {
  if (!map) {
    return;
  }
  // 初始化地图控件
  let zoomToExtent = new ZoomToExtent({
    extent: [110, 30, 160, 30],
  });
  map.addControl(zoomToExtent);
  // 放大缩小控件
  const zoomslider = new ZoomSlider();
  map.addControl(zoomslider);
  // 全屏控件
  const fullScreen = new FullScreen();
  map.addControl(fullScreen);
};

/**
 * 创建弹窗overlay
 */
const loadOverlayWindow = (node: HTMLElement, position = []) => {
  if (overlay) {
    map?.removeOverlay(overlay);
  }
  // 创建弹窗
  overlay = new Overlay({
    element: node,
    autoPan: true,
  });
  overlay.setPosition(position);
  map?.addOverlay(overlay);
};

/**
 * 删除弹窗
 */
const handleRemoveOverLayer = () => {
  if (overlay) {
    map?.removeOverlay(overlay);
  }
};

// 挂载组件
const componentMount = (props = {}) => {
  const app = createVNode(testDialog, props);
  const mountNode = document.createElement('div');
  render(app, mountNode);
  return mountNode;
};

/**
 * 地图单击事件
 */
const handleSingleClick = (e: any) => {
  let hdms = toStringHDMS(toLonLat(e.coordinate));
  let props = {
    hdms,
    onHandleClose: handleRemoveOverLayer,
  };
  let node = componentMount(props);
  loadOverlayWindow(node, e.coordinate);
};

/**
 * 到北京天安门
 */
const handleToTiananmen = () => {
  map?.getView().animate({
    duration: 500,
    center: transform([116.23, 39.54], 'EPSG:4326', 'EPSG:3857'),
    zoom: 16,
  });
};
</script>

<style lang="scss">
@import './style/index.scss';
.ol-zoomslider {
  top: 7.5em;
}
</style>
