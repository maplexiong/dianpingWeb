import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    doDetailString: "",
    aid: 30,
    pageNum: 0,
  },
  mutations: {
    setPageNum(state, val) {
      state.pageNum = val;
    },
    setDoDetail(state, val) {
      state.doDetailString = val;
    },
    setAid(state, val) {
      state.aid = val;
    },
  },
  getters: {
    getAid(state) {
      return state.aid;
    },
    getPageNum(state) {
      return state.pageNum;
    },
  },
  actions: {},
  modules: {},
});
