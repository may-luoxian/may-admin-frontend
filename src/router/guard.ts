import Cookies from 'js-cookie';
import router from './index';
import { useMenuHook } from '@/hooks/menu';
import { MAY_BLOG_TOKEN } from '@/setting/localeSetting';
import { useMenuStoreWithOut } from '@/stores/modules/menu';
import { getUserRouter } from '@/api/system';
const menuHook = useMenuHook();
const menuStore = useMenuStoreWithOut();
const whiteList = ['/login'];

router.beforeEach(async (to, from, next) => {
  // 跳转路径在白名单内，直接放行
  if (whiteList.includes(to.path)) {
    next();
    return;
  }
  // 不存在token，跳转登录
  const token = Cookies.get(MAY_BLOG_TOKEN);
  if (!token) {
    next('/login');
    return;
  }

  const hasDynamicAddedRoute = menuStore.getIsDynamicAddedRoute;
  if (hasDynamicAddedRoute) {
    next();
    return;
  }

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
