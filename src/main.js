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
    let knowns = {};
    console.log("NETWORK:", this.network);
    if (this.network == "main") {
      knowns["0xe9061c2517bba8a7e2d2c20053cd8323b577efe7"] = "Foundation Ops";
      knowns["0xab22ab75f8c42b6969c5d226f39aeb7be35bf24b"] = "Locked Batch 5";
      knowns["0x045df1ef32d6db371f1857bb60551ef2e43abb1e"] = "Locked Batch 3";
      knowns["0xbb8fca96089572f08736062b9c7da651d00011d0"] = "Locked Batch 4";
      knowns["0x08ebea6584b3d9bf6fbcacf1a1507d00a61d95b7"] = "Locked Batch 2";
      knowns["0x46b77531b74ff31882c4636a35547535818e0baa"] =
        "Foundation Growth Reserve Indefinitely Locked";
      knowns["0x63723217e860bc409e29b46eec70101cd03d8242"] = "Locked Batch 6";
      knowns["0x0374f5867ab2effd2277c895e7d1088b10ec9452"] = "Locked Batch 7";
      knowns["0x5308b6f26f21238963d0ea0b391eafa9be53c78e"] = "Locked Batch 8";
      knowns["0xbb28e3212cf0df458cb3ba2cf2fd14888b2d7da7"] = "Marketing";
      knowns["0x2fa2d56e312c47709537acb198446205736022aa"] = "Locked Batch 1";
      knowns["0x62e3e1df0430e6da83060b3cffc1adeb3792daf1"] = "Bridge Locked";
      knowns["0x6f04787447975b40d29611833711117ed9de155f"] = "mxc";
      knowns["0x78e6f3af2bf71afa209c6e81b161c6a41d2da79d"] = "Foundation Ops";
      knowns["0xc1a76f84d977e8d424a8eb09ce6adf029d38b91d"] = "Bilaxy";
      knowns["0x1c4b70a3968436b9a0a9cf5205c787eb81bb558c"] = "Gate.io";
      knowns["0x0d0707963952f2fba59dd06f2b425ace40b492fe"] = "Gate.io";
      knowns["0x5c5713656c6819ebe3921936fd28bed2a387cda5"] = "Bridge Active";
      knowns["0x687a6294d0d6d63e751a059bf1ca68e4ae7b13e2"] =
        "MTR system contract";
      knowns["0x228ebbee999c6a7ad74a6130e81b12f9fe237ba3"] =
        "MTRG system contract";
    }
    try {
      const res = await this.$api.known.getAddresses(this.network);
      const { addresses } = res;
      for (const k in addresses) {
        knowns[k.toLowerCase()] = addresses[k];
      }
    } catch (e) {
      console.log("ignore issue for getting known addresses");
    }
    store.commit("dom/SET_KNOWN_ADDRESSES", knowns);
    console.log("Knowns: ", knowns);

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
