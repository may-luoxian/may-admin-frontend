import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      token: "",
      userId: 0,
    };
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setUserId(id: number) {
      this.userId = id;
    },
  },
  getters: {
    getToken(): string {
      return this.token;
    },
    getUserId(): number {
      return this.userId;
    },
  },
  persist: true,
});
