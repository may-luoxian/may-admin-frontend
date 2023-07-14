import { defineStore } from "pinia";
import type { LayoutRoute } from "@/hooks/menu";

interface MenuState {
  userRoutes: LayoutRoute[];
  fold: boolean;
}

export const useMenuStore = defineStore("menu", {
  state: (): MenuState => {
    return {
      userRoutes: [],
      fold: false,
    };
  },
  actions: {
    setUserRoutes(routerMap: LayoutRoute[]) {
      this.userRoutes = routerMap;
    },
    toggleMenu() {
      this.fold = !this.fold;
    },
  },
  getters: {
    getUserRoutes(): LayoutRoute[] {
      return this.userRoutes;
    },
  },
});
