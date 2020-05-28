<template>
  <div id="app">
    <TopNav></TopNav>
    <!-- router content -->
    <router-view></router-view>
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from "./Footer.vue";
import TopNav from "./TopNav";

export default {
  name: "AppLayout",
  components: {
    TopNav,
    Footer
  }
};
</script>
s
