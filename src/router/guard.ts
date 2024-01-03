import Cookies from 'js-cookie';
import router from './index';
import { useMenuStore } from '@/stores/menu';
import { useMenuHook } from '@/hooks/menu';
import { useUserStore } from '@/stores/user';
import { useStorageHook } from '@/hooks/storage';
import { MAY_STORAGE, MAY_BLOG_TOKEN } from '@/setting/localeSetting';
const menuStore = useMenuStore();
const useMenu = useMenuHook();
const userStore = useUserStore();
const storageHook = useStorageHook();
const { getObjectStorage } = storageHook;

const whiteList = ['/login'];

/**
 * 路径在白名单内：直接放行
 * 不在白名单内，且缓存中包含用户信息，则有可能为用户登录或刷新页面时
 * 根据vuex中是否包含路由判断是否为刷新页面，若是，则重新调用接口获取路由表，并放行到当前页面。
 * 若不包含用户信息则直接跳转到登录页
 */
router.beforeEach(async (to, from, next) => {
  try {
    const userInfo = getObjectStorage(localStorage, MAY_STORAGE, 'user');
    if (whiteList.includes(to.path)) {
      next();
    } else {
      if (userInfo && userInfo.id && Cookies.get(MAY_BLOG_TOKEN)) {
        const isExist = menuStore.getUserRoutes.length === 0;
        if (isExist) {
          await useMenu.dynamicAddRoute();
          userStore.setUserInfo(userInfo);
          next({ ...to, replace: true });
        } else {
          next();
        }
      } else {
        next({ path: '/login' });
      }
    }
  } catch (err) {
    console.error(err);
  }
});
