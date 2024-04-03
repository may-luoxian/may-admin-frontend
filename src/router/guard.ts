import Cookies from 'js-cookie';
import router from './index';
import { useMenuHook } from '@/hooks/menu';
import { MAY_BLOG_TOKEN } from '@/hooks/storage';
import { useMenuStoreWithOut } from '@/stores/modules/menu';
import { useUserStoreWithOut } from '@/stores/modules/user';
import { getUserRouter, getUserInfo } from '@/api/system';
import { isEmpty } from '@/utils/is';
const menuHook = useMenuHook();
const menuStore = useMenuStoreWithOut();
const userStore = useUserStoreWithOut();
const whiteList = ['/login'];

router.beforeEach(async (to, from, next) => {
  // 跳转路径在白名单内，直接放行
  if (whiteList.includes(to.path)) {
    next();
    return;
  }
  // 不存在token，跳转登录（后续不执行）
  const token = Cookies.get(MAY_BLOG_TOKEN);
  if (!token) {
    next('/login');
    return;
  }

  // 如果用户信息不存在，获取信息
  const storeUserInfo = userStore.getUserInfo;
  if (isEmpty(storeUserInfo)) {
    try {
      const userInfo = (await getUserInfo()).data;
      userStore.setUserInfo(userInfo);
    } catch (err) {
      next();
    }
  }

  // 如果路由存在直接跳转目标页面
  const hasDynamicAddedRoute = menuStore.getIsDynamicAddedRoute;
  if (hasDynamicAddedRoute) {
    next();
    return;
  }

  // 若不存在构建动态路由
  const routes = (await getUserRouter()).data;
  menuHook.dynamicAddRoute(routes);
  menuStore.setIsDynamicAddedRoute(true);
  if (to.name === 'pageNotFound') {
    // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
    next({ path: to.fullPath, replace: true, query: to.query });
  } else {
    next();
  }
});
