<template>
  <div id="app">
    <main class="main-container">
      <!-- top nav -->
      <TopNav></TopNav>

      <!-- router content -->
      <router-view></router-view>
    </main>

    <!-- footer -->
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from "./Footer.vue";
import TopNav from "./TopNav";

import { getCurrentChain } from "@/config";
const { VUE_APP_CHAIN_ID } = process.env;

export default {
  name: "AppLayout",
  components: {
    TopNav,
    Footer,
  },
  mounted() {
    console.log("VUE_APP_CHAIN_ID", VUE_APP_CHAIN_ID);
    const chain = getCurrentChain(Number(VUE_APP_CHAIN_ID));
    this.$store.commit("dom/SET_NETWORK", chain.chainId);
  },
};
</script>
