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
    <DataDashboard v-bind:rows="block_data"></DataDashboard>

    <!-- node statistic -->
    <DataDashboard v-bind:rows="node_data"></DataDashboard>

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
import DataDashboard from "@/components/DataDashboard.vue";
import RecentBlocks from "@/components/RecentBlocks.vue";

export default {
  name: "Home",

  components: {
    Search,
    DataDashboard,
    RecentBlocks
  },

  data() {
    return {
      msg: "Welcome to Index!!!",
      block_data: [
        [
          {
            content: "$ 21.35",
            label: "MTRG Price",
            change: "+4.5%"
          },
          {
            content: "2351 MTRG",
            label: "Average Daily Reward Pool"
          }
        ],
        [
          {
            content: "33333",
            label: "Block Height"
          },
          {
            content: "55555",
            label: "K Block Height"
          },
          {
            content: "55%",
            label: "Stacked"
          },
          {
            content: "2343",
            label: "Validators"
          }
        ]
      ],
      node_data: [
        [
          {
            content: "235",
            label: "Validators"
          },
          {
            content: "235 MTRG",
            label: "Total Stacking"
          }
        ],
        [
          {
            content: "235",
            label: "Height"
          },
          {
            content: "12.4 USD",
            label: "Price"
          },
          {
            content: "78/90",
            label: "Online/ Toal Node"
          }
        ]
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.search-banner {
  background-image: url("~@/assets/banner_bg.png");
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
