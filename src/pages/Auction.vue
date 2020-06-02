<template>
  <div class="auction">
    <!-- search banner -->
    <div class="banner">
      <div class="container">
        <b-row>
          <b-col class="border-r">
            <div class="box">
              <p class="label">MTRG(Price)</p>
              <p class="value">12.9 USD</p>
            </div>
          </b-col>

          <b-col>
            <div class="box">
              <p class="label">MTRG(Price)</p>
              <p class="value">12.9 USD</p>
            </div>
          </b-col>
        </b-row>
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
import DataCard from "@/components/DataCard.vue";
import RecentBlocks from "@/components/RecentBlocks.vue";

export default {
  name: "Home",

  components: {
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
.banner {
  background-image: url("~@/assets/banner_bg.png");
  height: 164px;
  background-size: cover;
  display: flex;
  padding-top: 50px;

  .border-r {
    border-right: 1px solid rgba(255, 255, 255, 0.2);
  }

  .box {
    color: #fff;
    text-align: center;

    .label {
      font-size: 14px;
    }

    .value {
      font-size: 24px;
      font-weight: 600;
    }
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
