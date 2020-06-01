<template>
  <div class="home">
    <!-- search banner -->
    <div class="search-banner">
      <div class="container">
        <h1 class="title">Meter Blockchain Exlorer</h1>
        <Search />
      </div>
    </div>

    <!-- TODO:tab nav -->

    <!-- card list -->
    <!-- block statistic -->
    <b-container class="card">
      <b-row>
        <b-col class="border-r"><DataCard /></b-col>
        <b-col><DataCard /></b-col>
      </b-row>
      <hr />

      <b-row>
        <b-col class="border-r"><DataCard /></b-col>
        <b-col class="border-r"><DataCard /></b-col>
        <b-col class="border-r"><DataCard /></b-col>
        <b-col><DataCard /></b-col>
      </b-row>
    </b-container>

    <!-- node statistic -->
    <b-container class="card">
      <b-row>
        <b-col class="border-r"><DataCard /></b-col>
        <b-col><DataCard /></b-col>
      </b-row>
      <hr />

      <b-row>
        <b-col class="border-r"><DataCard /></b-col>
        <b-col class="border-r"><DataCard /></b-col>
        <b-col><DataCard /></b-col>
      </b-row>
    </b-container>

    <b-container>
      <b-row>
        <b-col>
          <RecentBlocks />
        </b-col>
        <b-col>
          <RecentBlocks />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Search from "@/components/Search.vue";
import DataCard from "@/components/DataCard.vue";
import RecentBlocks from "@/components/RecentBlocks.vue";

export default {
  name: "Home",

  components: {
    Search,
    DataCard,
    RecentBlocks
  },

  data() {
    return {
      msg: "Welcome to Index!!!"
    };
  }
};
</script>

<style lang="scss" scoped>
.search-banner {
  background-image: url("~@/assets/background.png");
  height: 210px;
  background-size: cover;
  display: flex;
  padding-top: 50px;

  .title {
    color: #fff;
    font-size: 20px;
    font-weight: 400;
    text-align: center;
  }
}

.card {
  margin: 1rem auto;
  padding: 1rem;

  hr {
    border-color: $border-light;
  }

  .border-r {
    border-right: 1px solid $border-light;
  }
}
</style>
