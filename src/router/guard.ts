import router from "./index";
import api from '@/api/api'

// const whiteList = ["/login"];

router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    next();
  } else {
    // api.getUserInfo()
  }
});
