import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/:catchAll(.*)',
    hidden: true,
    component: () => import('@/views/error/404.vue'),
  },
];

const options = {
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
};
const router = createRouter(options);

export default router;
