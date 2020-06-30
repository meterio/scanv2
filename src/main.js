import Vue from "vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

import AppLayout from "./layout/index.vue";
import router from "./router";
import store from "./store";

import api from "./api";

import "./mixins";

// import globalEventBus from "./plugins/globalEventBus";

import "./scss/style.scss";
import "./assets/fonts/bebasneue.css";

// 将api挂载到vue的原型上
Vue.prototype.$api = api;

// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

// Vue.use(globalEventBus);

Vue.config.productionTip = false;

new Vue({
  name: "Root",
  router,
  store,
  mounted() {
    store.commit("dom/SET_WINDOW_WIDTH", window.innerWidth);
    window.addEventListener("resize", () =>
      store.commit("dom/SET_WINDOW_WIDTH", window.innerWidth)
    );
  },
  beforeDestroy() {
    window.removeEventListener("resize", () =>
      store.commit("dom/SET_WINDOW_WIDTH", window.innerWidth)
    );
  },
  render: h => h(AppLayout)
}).$mount("#app");
