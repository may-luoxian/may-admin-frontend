/* eslint-disable no-undef */
export let apiOnReady = false;
export let options = {
  //必选参数，网页显示视频流的domId
  domId: 'player',

  //可选参数，实例id
  iid: '2543308125055',

  //可选参数，工程索引
  pid: 1,

  //必选参数，二次开发时必须指定，否则无法进行二次开发
  apiOptions: {
    //必选参数，与云渲染主机通信成功后的回调函数
    //注意：对场景的一切操作, 请在onready之后执行
    onReady: _onReady,

    //可选参数，日志输出回调函数 开发调试需要
    onLog: _onLog,

    //可选参数，三维场景交互事件回调函数
    onEvent: _onEvent,

    //可选参数，日志颜色，默认关闭
    useColorLog: false,
  },

  //可选参数 控制UI界面元素显示
  ui: {
    startupInfo: true, //默认值为true，初始化过程中是否显示左上角详细信息（如果不需要，直接去掉此属性即可）
    statusIndicator: true, //默认值为true，左上角闪烁的状态指示灯，可以从不同的颜色看出当前的状态
    statusButton: true, //默认值为false，是否在左下角显示信息按钮（如果不需要，直接去掉此属性即可）
    fullscreenButton: true, //默认值为false，是否在右下角显示全屏按钮（如果不需要，直接去掉此属性即可）
    homeButton: true, //默认值为false，是否在左下角显示“回到初始位置”按钮（如果不需要，直接去掉此属性即可）
    taskListBar: 1, //默认值为1，是否在下方显示“任务队列（API调用队列）”信息（0: 永不显示；1: 执行比较耗时的操作时显示；2: 一直显示）
    debugEventsPanel: false, //是否显示事件详细信息（仅用于调试）
    mainUI: true, //是否显示Cloud的UI工具栏，如果设置为true就显示，如果设置为false就隐藏，如果没有设置，就保持原状。
    campass: true, //是否显示指北针，如果设置为true就显示，如果设置为false就隐藏，如果没有设置，就保持原状。
  },

  //可选参数
  reset: false, //指定是否重置实例。如果设置reset为true，每次连接（包括刷新）都会得到一个全新的实例（第一次打开acp工程的初始化状态）
  keyEventTarget: 'video', //默认值为'video'，设置键盘交互事件，可选的值：'document'、'video' 、'none'
  useBuiltinCursors: true, //默认值为true，是否使用内置光标。
  password: false, //设置实例的访问密码，如果服务设置了密码，那么客户端需要提供正确的密码才能连接实例
  urlExtraInfo: {
    //可以在WebSocket URL后面附加其他信息（例如认证信息等）（如果不需要，直接去掉此属性即可）
    //_ip: '192.168.1.8',
    //_token: 'm0ybqxw3ra2tifzvphlj571c9eu6sg4o'
  },

  //可选参数 自定义事件交互
  events: {
    //鼠标、键盘交互事件的回调，后面可以随时通过setActionEventEnabled进行开关
    mouseKeyListener: {
      onKeyDown: (e) => console.info(`KeyDown: ${e.code}`),
    },

    //当视频流加载成功后触发
    onVideoLoaded: () => console.info('Video stream loaded success.'),

    //服务连接断开的回调函数
    onConnClose: (e) => console.info(`Connection closed: ${e.code}`),

    //用于接收视频流的状态信息，例如：帧率、码率、QP等
    onRtcStatsReport: (stats) => (document.title = `当前帧速率--FPS:${stats.framesPerSecond || 0}`),
  },
};

function _onReady() {
  apiOnReady = true;
  //TODO 注意：在_onReady完成后才可以调用api接口
}

//参考事件交互系统的专题文档
function _onEvent(event) {
  //事件类型 参考交互事件类型枚举对象
  var eventType = event.eventtype;
  //图层类型
  var layerType = event.Type;
  //图层Id
  var layerId = event.Id || event.ID;
  //点击ActorId
  var objectId = event.ObjectID;
  //当前点击位置
  var objectLocation = event.MouseClickPoint;

  //同时监听事件类型和对象类型
  if (event.eventtype == 'LeftMouseButtonClick' && event.Type == 'TileLayer') {
    console.info('当前点击图层的位置：' + event.MouseClickPoint);
    //操作TileLayer图层事件
    //__g.tileLayer.stopHighlightActor(event.Id, event.ObjectID);
  }

  if (event.eventtype == 'LeftMouseButtonClick' && event.Type == 'marker') {
    //操作marker事件
    //__g.marker.delete(event.Id);
  }

  //只监听事件类型
  switch (eventType) {
    //鼠标左键点击时触发此事件
    case 'LeftMouseButtonClick':
      console.info('触发事件类型：鼠标左键单击，eventType：' + eventType);
      break;

    //鼠标悬停时触发此事件
    //注意需提前开启鼠标拾取：__g.settings.setMousePickMask(7);
    case 'MouseHovered':
      console.info('触发事件类型：鼠标悬停，eventType：' + eventType);
      break;

    //鼠标移动时触发此事件
    //注意需提前开启鼠标拾取：__g.settings.setMousePickMask(7);
    case 'MouseMoved':
      console.info('触发事件类型：鼠标移动，eventType：' + eventType);
      break;

    //相机开始移动时触发此监听事件
    //注意需先开启事件：__g.settings.setEnableCameraMovingEvent(true);
    case 'CameraStartMove':
      console.info('触发事件类型：相机开始飞行，eventType：' + eventType);
      break;

    //相机正在移动时触发此监听事件
    //注意需先开启事件：__g.settings.setEnableCameraMovingEvent(true);
    case 'CameraMoving':
      console.info('触发事件类型：相机正在飞行，eventType：' + eventType);
      break;

    //相机停止移动时触发此监听事件
    //注意需先开启事件：__g.settings.setEnableCameraMovingEvent(true);
    case 'CameraStopMove':
      console.info('触发事件类型：相机停止飞行，eventType：' + eventType);
      break;

    //对象执行focus()或相机执行set()/lookAt()/lookAtBBox()方法时触发
    case 'CameraChanged':
      console.info('触发事件类型：相机位置发生变化，eventType：' + eventType);
      break;

    //进入面剖切模式，编辑面剖切位置后触发事件并返回剖切结果
    case 'PlaneClipEdit':
      console.info('触发事件类型：编辑面剖切，eventType：' + eventType);
      break;

    //进入体剖切模式，编辑体剖切位置后触发事件并返回剖切结果
    case 'VolumeClipEdit':
      console.info('触发事件类型：编辑体剖切，eventType：' + eventType);
      break;

    //进入测量模式后，测量完成时触发此事件并返回测量结果
    case 'Measurement':
      console.info('触发事件类型：测量完成，eventType：' + eventType);
      break;

    //播放导览结束触发此事件
    //__g.camera.playAnimation(id)和导览对象播放导览结束__g.cameraTour.play(id)均触发此事件
    case 'CameraTourFinished':
      console.info('触发事件类型：播放导览结束，eventType：' + eventType);
      break;

    default:
      '';
  }
}

//开发时调试输出日志  生产环境推荐关闭
function _onLog(s, nnl) {
  var logStr = s + (nnl ? '' : '\n');
  console.info(logStr);
}

export function initAirCity() {
  let host = import.meta.env.VITE_AIRCITY_HOST;

  // eslint-disable-next-line no-undef
  __g = new DigitalTwinPlayer(host, options).getAPI();
  return { __g, apiOnReady };
}

export function destoryAirCity() {
  __g.destroy();
}

//重置场景
export function reset() {
  console.log(apiOnReady, __g);
  if (apiOnReady) {
    __g.reset();
  }
}

//查询图层树
export function infoTree() {
  if (apiOnReady) {
    __g.infoTree.get();
  }
}

//显示隐藏UI
let __uiVisible = false;
export function hideUI() {
  if (apiOnReady) {
    __uiVisible = !__uiVisible;
    __g.settings.setMainUIVisibility(__uiVisible);
  }
}

//显示隐藏指北针
let __cpVisible = false;
export function hideCompass() {
  if (apiOnReady) {
    __cpVisible = !__cpVisible;
    __g.settings.setCampassVisible(__cpVisible);
  }
}

//添加标签
export function addMarker() {
  if (apiOnReady) {
    __g.marker.clear();
    //支持经纬度坐标和普通投影坐标两种类型
    let m1 = {
      id: 'm1',
      groupId: 'markerAdd',
      coordinate: [492571.645, 2492232.64, 8.172598876953126], //坐标位置
      coordinateType: 0, //默认0是投影坐标系，也可以设置为经纬度空间坐标系值为1
      anchors: [-25, 50], //锚点，设置Marker的整体偏移，取值规则和imageSize设置的宽高有关，图片的左上角会对准标注点的坐标位置。示例设置规则：x=-imageSize.width/2，y=imageSize.height
      imageSize: [50, 50], //图片的尺寸
      hoverImageSize: [50, 50], //鼠标悬停时显示的图片尺寸
      range: [1, 10000], //可视范围
      imagePath: 'C:/Users/admin/AppData/Roaming/AirCityCloud/5.4/SDK/' + '/samples/images/tag.png', //显示图片路径
      hoverImagePath: 'C:/Users/admin/AppData/Roaming/AirCityCloud/5.4/SDK/' + '/samples/images/hilightarea.png', // 鼠标悬停时显示的图片路径
      fixedSize: true, //图片固定尺寸，取值范围：false 自适应，近大远小，true 固定尺寸，默认值：false

      text: '小别墅', //显示的文字
      useTextAnimation: false, //关闭文字展开动画效果 打开会影响效率
      textRange: [1, 1000], //文本可视范围[近裁距离, 远裁距离]
      textOffset: [0, 0], // 文本偏移
      textBackgroundColor: Color.SpringGreen, //文本背景颜色
      fontSize: 24, //字体大小
      fontOutlineSize: 1, //字体轮廓线大小
      fontColor: Color.White, //字体颜色
      fontOutlineColor: Color.Black, //字体轮廓线颜色

      popupURL: 'C:/Users/admin/AppData/Roaming/AirCityCloud/5.4/SDK/' + '/samples/popup/interact.html', //弹窗HTML链接
      popupBackgroundColor: [1.0, 1.0, 1.0, 0.5], //弹窗背景颜色
      popupSize: [300, 300], //弹窗大小
      popupOffset: [0, 0], //弹窗偏移

      showLine: true, //标注点下方是否显示垂直牵引线
      lineSize: [2, 100], //垂直牵引线宽度和高度[width, height]
      lineColor: Color.SpringGreen, //垂直牵引线颜色
      lineOffset: [0, 0], //垂直牵引线偏移

      autoHidePopupWindow: true, //失去焦点后是否自动关闭弹出窗口
      autoHeight: false, // 自动判断下方是否有物体
      displayMode: 4, //智能显示模式  开发过程中请根据业务需求判断使用四种显示模式
      clusterByImage: true, // 聚合时是否根据图片路径分类，即当多个marker的imagePath路径参数相同时按路径对marker分类聚合
      priority: 0, //避让优先级
      occlusionCull: false, //是否参与遮挡剔除
    };
    __g.marker.add(m1);
    __g.marker.focus('m1');
  }
}

//控制相机移动
export function moveCamera() {
  if (apiOnReady) {
    //x, y, z, pitch, yaw, flyTime
    __g.camera.set(493125.343477, 2492035.333125, 9.538418, -24.066826, 32.362339, 1);
  }
}

//添加自定义模型
export async function addCo() {
  if (apiOnReady) {
    //添加前清空所有customObject 防止id重复
    __g.customObject.clear();
    //模型的放置坐标位置
    let co_location = [493136.65625, 2492025.6, 2.35052978515625];
    let co1 = {
      id: 'co1', //自定义对象唯一id
      pakFilePath: '@path:DTS_Library.pak', //资源库pak文件路径,推荐使用cloud内置的文件资源管理器加载pak并使用@path方式传入参数
      assetPath: '/JC_CustomAssets/ObjectLibrary/Exhibition/室外/交通指示牌/BP_交通指示牌_组合A', //资源目录，自定义对象在pak文件资源包里的相对路径
      location: co_location, //位置坐标
      coordinateType: 0, // 坐标系类型
      rotation: [0, 180, 0], // 世界坐标系旋转
      localRotation: [0, 0, 0], //模型自身旋转
      scale: [1, 1, 1], //模型缩放
      smoothMotion: 1, //1: 平滑移动(针对需要移动的模型)，0: 跳跃移动
    };

    let co2 = {
      id: 'co2', //自定义对象唯一id
      pakFilePath: '@path:DTS_Library.pak', //资源库pak文件路径,推荐使用cloud内置的文件资源管理器加载pak并使用@path方式传入参数
      assetPath: '/Game/Common/Asset_Bank/Mesh/Car/BP_Car_JiuHuChe', //资源目录，自定义对象在pak文件资源包里的相对路径
      location: [493132.125, 2492028.25, 2.1155664920806885], //位置坐标
      coordinateType: 0, // 坐标系类型
      rotation: [0, 0, 0], // 世界坐标系旋转
      localRotation: [0, 0, 0], //模型自身旋转
      scale: [1, 1, 1], //模型缩放
      smoothMotion: 1, //1: 平滑移动，0: 跳跃移动
    };

    //批量添加co
    await __g.customObject.add([co1, co2]);
    __g.customObject.focus(co2.id);
  }
}
