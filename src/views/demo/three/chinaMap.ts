import * as THREE from 'three';
import * as d3 from 'd3';
import TWEEN from '@tweenjs/tween.js';
import chinaJson from './china.json';
export class ChinaMap {
  private map: any; // 地图
  private raycaster: any; // 光射线投影
  private mouse: any; // 鼠标Vector2坐标
  private mouseOffset: any; // 鼠标client位置
  private onMouseMove: any;
  private options: any;
  private lastPick: any; // 射线上一次命中的map-block

  // 传入需要加载地图的场景
  constructor(options: any) {
    this.options = options;
  }

  // 初始化地图
  init() {
    this.map = new THREE.Object3D();
    // 墨卡托投影转换
    const projection = d3.geoMercator().center([104.0, 37.5]).scale(80).translate([0, 0]);
    chinaJson.features.forEach((elem) => {
      // 定一个省份3D对象
      const province: any = new THREE.Object3D();
      // 每个省份坐标数组
      const coordinates = elem.geometry.coordinates;
      coordinates.forEach((multiPolygon) => {
        multiPolygon.forEach((polygon) => {
          // 创建多边形轮廓
          const shape = new THREE.Shape();
          // 创建材质
          const lineMaterial = new THREE.LineBasicMaterial({ color: 'white' });
          // 创建缓冲类型几何体
          const lineGeometry = new THREE.BufferGeometry();
          let vertices: any = [];
          for (let i = 0; i < polygon.length; i++) {
            const [x, y]: any = projection(polygon[i] as any);
            if (i === 0) {
              shape.moveTo(x, -y);
            }
            shape.lineTo(x, -y);
            vertices.push(x, -y, 4.01);
          }
          vertices = new Float32Array(vertices);
          lineGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
          const extrudeSettings = {
            depth: 4,
            bevelEnabled: false,
          };
          // 根据轮廓挤压出高度
          const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
          const material = new THREE.MeshBasicMaterial({ color: '#02A1E2', transparent: true, opacity: 0.6 });
          const material1 = new THREE.MeshBasicMaterial({ color: '#3480C4', transparent: true, opacity: 0.5 });
          const mesh = new THREE.Mesh(geometry, [material, material1]);
          mesh.name = 'map-block';
          const line = new THREE.Line(lineGeometry, lineMaterial);
          province.add(mesh);
          province.add(line);
        });
      });
      // 向各个省份中加入省份信息
      province.properties = elem.properties;
      if (elem.properties.centroid) {
        const [x, y]: any = projection(elem.properties.centroid as any);
        province.properties._centroid = [x, y];
      }
      this.map.add(province);
      this.map.rotateX(-Math.PI / 4);
    });
    this.options.scene.add(this.map);
    this.setRaycaster(this.options.width, this.options.height, this.options.dom);
    this.render();
    this.tweenRender();
  }

  /**
   * 设置光射线投影
   * 当canvas宽高变化时需要重新设置
   */
  setRaycaster(width: number, height: number, el: any) {
    this.options.width = width;
    this.options.height = height;
    this.options.dom = el;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.mouseOffset = {};
    this.onMouseMove = (event: MouseEvent) => {
      // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)，内嵌页面需要减去距离右、上的距离
      const offsetleft = this.options.dom.value.offsetLeft;
      const offsettop = this.options.dom.value.offsetTop;
      this.mouse.x = ((event.clientX - offsetleft) / this.options.width) * 2 - 1;
      this.mouse.y = -((event.clientY - offsettop) / this.options.height) * 2 + 1;
      this.mouseOffset.x = event.clientX;
      this.mouseOffset.y = event.clientY;
    };
    window.addEventListener('mousemove', this.onMouseMove, false);
  }

  // 销毁所有监听
  destroyListener() {
    window.removeEventListener('mousemove', this.onMouseMove, false);
  }

  render() {
    requestAnimationFrame(this.render.bind(this));
    // 通过摄像机和鼠标位置更新射线
    this.raycaster.setFromCamera(this.mouse, this.options.camera);
    // 计算物体和射线的焦点
    const intersects = this.raycaster.intersectObjects(this.map.children);
    if (this.lastPick) {
      const lastMesh = this.lastPick.object;
      lastMesh.material[0].color.set('#02A1E2');
      lastMesh.material[1].color.set('#3480C4');
      const lastTween = new TWEEN.Tween(lastMesh.position);
      lastTween.to({ x: 0, y: 0, z: 0 }, 300).start();
    }
    this.lastPick = null;
    this.lastPick = intersects.find((item: any) => item.object.name === 'map-block');
    if (this.lastPick) {
      const mesh = this.lastPick.object;
      mesh.material[0].color.set('#eefe3f');
      mesh.material[1].color.set('#eefe3f');
      const tween = new TWEEN.Tween(mesh.position);
      tween.to({ x: 0, y: 0, z: 3 }, 100).start();
    }
    this.options.renderer.render(this.options.scene, this.options.camera);
  }

  tweenRender() {
    TWEEN.update();
    requestAnimationFrame(this.tweenRender.bind(this));
  }
}
