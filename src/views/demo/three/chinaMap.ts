import * as THREE from 'three';
import * as d3 from 'd3';
import chinaJson from './china.json';
export class ChinaMap {
  private scene: any; // 场景
  private camera: any; // 相机
  private renderer: any; // 渲染器
  private map: any; // 地图
  private raycaster: any; // 光射线投影
  private mouse: any; // 鼠标Vector2坐标
  private mouseOffset: any; // 鼠标client位置
  private onMouseMove: any;
  private options: any;

  // 传入需要加载地图的场景
  constructor(options: any) {
    this.scene = options.scene;
    this.camera = options.camera;
    this.renderer = options.renderer;
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
      console.log(province);
      this.map.add(province);
      this.map.rotateX(-Math.PI / 4);
    });
    this.scene.add(this.map);
    this.setRaycaster();
    this.render();
  }

  // 设置光射线投影
  setRaycaster() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.mouseOffset = {};
    this.onMouseMove = (event: MouseEvent) => {
      // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
      console.log(this.options.width, this.options.height)
      this.mouse.x = (event.clientX / this.options.width) * 2 - 1;
      this.mouse.y = -(event.clientY / this.options.height) * 2 + 1;
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
    this.raycaster.setFromCamera(this.mouse, this.camera);
    // 计算物体和射线的焦点
    const intersects = this.raycaster.intersectObjects(this.map.children);
    if (intersects && intersects.length > 0) {
      intersects.forEach((element: any) => {
        if (element.object.material.length === 2) {
          element.object.material[0].color.setHex('#02A1E2');
          element.object.material[1].color.setHex('#3480C4');
        }
      });
    }
    this.renderer.render(this.scene, this.camera);
  }
}
