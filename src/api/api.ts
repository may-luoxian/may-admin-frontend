import axios from "axios";
import { app } from "@/main";
import type {
  // InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
// import { ResData } from "@/api/types";

const instance = axios.create({
  baseURL: "/api",
  timeout: 5000,
});

//TODO: 请求token校验，待登录功能完成后解开注释
// instance.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
//   config.headers["Authorization"] = "Bearar" + sessionStorage.getItem("token");
//   return config;
// });

instance.interceptors.response.use(
  (config: AxiosResponse): AxiosResponse => {
    switch (config.data.code) {
      case 50000:
        app.config.globalProperties.$notify({
          title: "Error",
          message: "系统异常，请联系管理员",
          type: "error",
        });
        break;
      case 40000:
        app.config.globalProperties.$notify({
          title: "Error",
          message: "用户未登录",
          type: "error",
        });
        break;
      case 51000:
        app.config.globalProperties.$notify({
          title: "Error",
          message: "用户不存在",
          type: "error",
        });
        break;
    }
    return config.data;
  },
  (error: AxiosResponse): Promise<AxiosResponse> => {
    return Promise.reject(error);
  }
);

export default {
  // 登录
  login: (username: string, password: string) => {
    let params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);
    return instance.post("/users/login", params);
  },
  // 获取系统菜单
  getSystemMenu: () => {
    return instance.get("/system/menus");
  },
  // 获取用户信息
  getUserInfo(userid: number) {
    return instance.get("/users/info")
  }
};
