import { defineStore } from "pinia";
export const useMenuStore = defineStore("menu", {
  state: () => {
    return {
      menuTable: [],
      userRoutes: [],
    };
  },
  getters: {
    getMenuTable(): any {
      return this.menuTable;
    },
    getUserRoutes(): any {
      return this.userRoutes;
    },
  },
  actions: {
    setMenuTable(menuTable: any) {
      this.menuTable = menuTable;
    },
    setUserRoutes(routerMap: any) {
      this.userRoutes = routerMap;
    },
  },
  persist: true,
});
