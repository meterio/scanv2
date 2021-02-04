import Vue from "vue";
import Vuex from "vuex";
import modules from "./modules";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    home_block_height: 0,
  },
  mutations: {
    CONFIGVAL(state, { key, val }) {
      state[key] = val;
    },
  },
  actions: {
    configVal({ commit }, { key, val }) {
      commit("CONFIGVAL", { key: key, val: val });
    },
  },
  modules,
  strict: process.env.NODE_ENV === "development",
});
