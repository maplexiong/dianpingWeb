import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
// import axios from "./axios";

import qs from "qs";
/**
 * 引入element
 **/

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

ElementUI.Dialog.props.closeOnClickModal.default = false;
/**
 *
 * 引入并注册全局组件
 *
 */

import search from "./components/search.vue";
import page0 from "./components/pages/page0.vue";
import page1 from "./components/pages/page1.vue";
import page2 from "./components/pages/page2.vue";
import page3 from "./components/pages/page3.vue";
import footer from "./components/footer.vue";
import login from "./components/user/login.vue";

import ArticleDetail from "./components/article/ArticleDetail.vue";
Vue.component("app-ArticleDetail", ArticleDetail);
Vue.component("app-search", search);
Vue.component("app-page0", page0);
Vue.component("app-page1", page1);
Vue.component("app-page2", page2);
Vue.component("app-page3", page3);
Vue.component("app-footer", footer);
Vue.component("app-login", login);

Vue.config.productionTip = false;

axios.defaults.baseURL = "http://www.xunfen.xyz:8889";
axios.defaults.withCredentials = true;
axios.defaults.headers = {
  "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
};

Vue.prototype.axios = axios;

Vue.prototype.qs = qs;

// 简介文字过滤器    250个字符,其它的用......代替
Vue.filter("contentFilter", function(msg) {
  msg.length >= 150 ? (msg = msg.substring(0, 150) + "...") : (msg = msg);
  return msg;
});
Vue.filter("title", function(msg) {
  msg.length >= 16 ? (msg = msg.substring(0, 16) + "...") : (msg = msg);
  return msg;
});

// 日期毫秒数的过滤器
Vue.filter("dateFilter", function(msg) {
  function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);
    var Y = date.getFullYear() + "-";
    var M =
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) + "-";
    var D = date.getDate() + " ";
    var h = date.getHours() + ":";
    var m = date.getMinutes() + ":";
    var s = date.getSeconds();
    return Y + M + D + h + m + s;
  }
  return timestampToTime(msg);
});

Vue.filter("date", function renderTime(date) {
  var dateee = new Date(date).toJSON();
  return new Date(+new Date(dateee) + 8 * 3600 * 1000)
    .toISOString()
    .replace(/T/g, " ")
    .replace(/\.[\d]{3}Z/, "");
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
