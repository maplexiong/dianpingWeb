import axios from "axios"; //引入axios
import qs from "qs";
import Vue from "vue";
import { Message } from "element-ui";

let instance = axios.create({
  baseURL: "http://www.xunfen.xyz:8889",
  withCredentials: true,
  // timeout: 2000,
});

instance.interceptors.request.use(
  (config) => {
    if (config.method === "post" || config.method === "put") {
      config.headers["Content-Type"] =
        "application/x-www-form-urlencoded;charset=UTF-8";
      // config.data = qs.stringify(config.data);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// http response 拦截器
instance.interceptors.response.use(
  (response) => {
    console.log("触发响应拦截器...");
    // Message.error("哈哈哈");
    return response;
  },
  (error) => {
    console.log("请求响应出现错误");
    return Promise.reject(error);
  }
);

export default instance;
