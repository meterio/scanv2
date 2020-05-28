<template>
  <div class="homebanner">
    <div class="container">
      <h1 class="title">Meter Blockchain Exlorer</h1>
      <Search />
    </div>
  </div>
</template>

<script>
import Search from "@/components/Search.vue";

export default {
  name: "Home",

  components: {
    Search
  },

  data() {
    return {
      msg: "Welcome to Index!!!"
    };
  }
};
</script>

<style lang="scss" scoped>
.homebanner {
  background-image: url("~@/assets/background.png");
  height: 210px;
  background-size: cover;
  display: flex;
  padding-top: 50px;
}

.homebanner .title {
  color: #fff;
  font-size: 20px;
  font-weight: 400;
  text-align: center;
}
</style>
