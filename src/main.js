import Vue from "vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

import AppLayout from "./layout/index.vue";
import router from "./router";
import store from "./store";
import {
  fromWei,
  fromNow,
  shortHash,
  shortAddress,
  formatTime,
  formatDuration
} from "@/utils";
import api from "./api";

import "./mixins";

// import globalEventBus from "./plugins/globalEventBus";

import "./scss/style.scss";
// import "./assets/fonts/bebasneue.css";
import "./assets/fonts/nunito/nunito.css";

// 将api挂载到vue的原型上
Vue.prototype.$api = api;
Vue.prototype.$network = "";

// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

// Vue.use(globalEventBus);

Vue.config.productionTip = false;

var mixin = {
  computed: {
    network() {
      return this.$store.state.dom.network;
    }
  },
  beforeMount() {
    if (this.init) this.init();
  },
  watch: {
    $route(to, from) {
      if (this.init) this.init();
    },
    network(to, from) {
      if (this.init) this.init();
    }
  },
  methods: {
    fromNow(time) {
      return fromNow(time * 1000);
    },
    shortAddr(addr, precision) {
      return shortAddress(addr, precision);
    },
    shortHash(hash, precision) {
      return shortHash(hash, precision);
    },
    formatTime(time) {
      return formatTime(time * 1000);
    },
    fromWei(num, precision) {
      return fromWei(num, precision);
    },
    formatDuration(duration) {
      return formatDuration(duration);
    }
  }
};

Vue.mixin(mixin);

new Vue({
  name: "Root",
  router,
  store,
  async mounted() {
    try {
      const res = await this.$api.known.getAddresses(this.network);
      const { addresses } = res;
      store.commit("dom/SET_KNOWN_ADDRESSES", addresses);
      console.log("Knowns: ", addresses);
    } catch (e) {
      console.log("ignore issue for getting known addresses");
    }

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
