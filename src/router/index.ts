import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/modules/login/index.vue'),
  },
  {
    path: '/:catchAll(.*)',
    name: 'pageNotFound',
    hidden: true,
    component: () => import('@/modules/error/404.vue'),
  },
];

const options = {
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
};
const router = createRouter(options);

// export function resetRouter() {
//   router.getRoutes().forEach((route) => {

//   })
// }

export default router;
