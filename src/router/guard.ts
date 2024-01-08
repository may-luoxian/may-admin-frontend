import Cookies from 'js-cookie';
import router from './index';
import { useMenuHook } from '@/hooks/menu';
import { MAY_BLOG_TOKEN } from '@/setting/localeSetting';
import { useMenuStore } from '@/stores/menu';
import { useUserStore } from '@/stores/user';
import { isEmpty } from '@/utils/is';
const menuStore = useMenuStore();
const menuHook = useMenuHook();
const userStore = useUserStore();

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
  const routes = menuStore.getUserRoutes;
  if (isEmpty(routes)) {
    // 添加路由
    await menuHook.dynamicAddRoute();
  }

  // const userInfo = userStore.getUserInfo
  // if (isEmpty(userInfo)) {

  // }

  if (to.name === 'pageNotFound') {
    // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
    next({ path: to.fullPath, replace: true, query: to.query });
  } else {
    next();
  }
});
