<template>
  <div id="app">
    <TopNav></TopNav>

    <b-container>
      <router-view></router-view>
    </b-container>
    <AppFooter></AppFooter>
  </div>
</template>

<script>
import AppFooter from "./Footer.vue";
import TopNav from "./TopNav";

export default {
  name: "AppLayout",
  components: {
    TopNav,
    AppFooter
  }
};
</script>
s
