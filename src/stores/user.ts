import { defineStore } from "pinia";
import Cookies from "js-cookie";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      token: "" as string,
      userInfo: {},
    };
  },
  actions: {
    setToken(token: string) {
      this.token = token;
      Cookies.set("token", token, {
        expires: 1,
      });
    },
    setUserInfo(data: any) {
      this.userInfo = data;
      localStorage.setItem("user", JSON.stringify(data))
    },
  },
  getters: {
    getToken(): string {
      return this.token;
    }
  },
});
