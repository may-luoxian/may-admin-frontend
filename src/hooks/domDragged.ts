import { ref } from 'vue';

export const useDomDraggedHook = (parentDom: any) => {
  let isMouseDown = ref<boolean>(false);
  let startClientX = ref<number>(0);
  let moveClientX = ref<number>(0);
  let dragBarIndex = ref<number>(-1);
  let parentLeft = ref<number>(0);

  // 处理鼠标按下
  const mouseDown = (e: MouseEvent) => {
    document.onselectstart = () => false;
    isMouseDown.value = true;
    startClientX.value = e.clientX;
    draggedListener();
    createVirtualDom(e);
  };

  // 创建拖动时显示的虚拟div
  const createVirtualDom = (e: MouseEvent) => {
    let childrenDoms = parentDom.value.children;
    for (let i = 0; i < childrenDoms.length; i++) {
      if (childrenDoms[i] === e.target) {
        dragBarIndex.value = i;
      }
    }
    parentLeft.value = parentDom.value.getBoundingClientRect().left;
    let virtualX = e.clientX - parentLeft.value;
    parentDom.value.style.position = 'relative';
    let dragBar = document.createElement('div');
    dragBar.style.height = '100%';
    dragBar.style.width = '1px';
    dragBar.style.textAlign = 'center';
    dragBar.style.border = '1px dashed #409EFF';
    dragBar.style.left = virtualX + 'px';
    dragBar.style.position = 'absolute';
    dragBar.classList.add('virtual-dom');
    dragBar.style.zIndex = '9999';
    childrenDoms[dragBarIndex.value].appendChild(dragBar);
  };

  // 监听鼠标拖动事件
  const draggedListener = () => {
    document.addEventListener('mousemove', handleMouseDragged);
  };

  // 鼠标拖动处理
  const handleMouseDragged = (e: MouseEvent) => {
    moveClientX.value = e.clientX;
    setBarStyle(e);
  };

  // 处理拖动时，拖动条样式
  const setBarStyle = (e: MouseEvent) => {
    let virtualDom: any = document.getElementsByClassName('virtual-dom')[0];
    let childrenDoms = parentDom.value.children;
    let virtualDomWidth = childrenDoms[dragBarIndex.value].getBoundingClientRect().width;
    let virtualX = e.clientX - parentDom.value.getBoundingClientRect().left;
    if (virtualX < virtualDomWidth) {
      virtualX = virtualDomWidth;
    } else if (virtualX > parentDom.value.getBoundingClientRect().width - virtualDomWidth) {
      virtualX = virtualDomWidth - virtualDomWidth;
    }
    virtualDom.style.left = virtualX + 'px';
  };

  // 处理鼠标抬起
  const mouseUp = () => {
    document.removeEventListener('mousemove', handleMouseDragged);
    let offset = startClientX.value - moveClientX.value;
    let leftDom = parentDom.value.children[dragBarIndex.value - 1];
    let rightDom = parentDom.value.children[dragBarIndex.value + 1];
    let leftDomWidth = leftDom.getBoundingClientRect().width;
    let rightDomWidth = rightDom.getBoundingClientRect().width;
    leftDom.style.width = leftDomWidth - offset + 'px';
    rightDom.style.width = rightDomWidth + offset + 'px';
    isMouseDown.value = false;
    document.onselectstart = () => true;
    removeVirtualDom();
  };

  // 移除虚拟div
  const removeVirtualDom = () => {
    let centerDom = parentDom.value.children[dragBarIndex.value];
    let child = centerDom.lastElementChild;
    while (child) {
      centerDom.removeChild(child);
      child = centerDom.lastElementChild;
    }
  };
  return {
    mouseDown,
    mouseUp,
  };
};
