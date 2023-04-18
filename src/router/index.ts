import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
  },
];

let options = {
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory(""),
  routes: routes,
};

const router = createRouter(options);

export default router;
