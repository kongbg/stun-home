import axios from "axios";
import { ElMessage } from "element-plus";
import { getToken } from "@/utils/auth";

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
// axios.defaults.withCredentials = true
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: "/api", //import.meta.env.VITE_APP_BASE_API,
  // 超时
  timeout: 10000,
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false;
    if (getToken() && !isToken) {
      config.headers["Authorization"] = "Bearer " + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }

    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态
    let code = res.data.code || 200;

    // 二进制数据则直接返回
    if (
      res.request.responseType === "blob" ||
      res.request.responseType === "arraybuffer"
    ) {
      return res.data;
    }

    return Promise.resolve(res.data);
  },
  (error) => {
    console.log(error)
    // 优先取后端返回的错误信息
    let errMsg = error?.response?.data?.msg || "";

    ElMessage({ message: errMsg, type: "error", duration: 3 * 1000 });
    return Promise.reject(error);
  }
);
export default service;
