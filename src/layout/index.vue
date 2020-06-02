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

export default {
  name: "AppLayout",
  components: {
    TopNav,
    Footer
  }
};
</script>
s
