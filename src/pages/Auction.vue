<template>
  <div class="auction">
    <!-- banner -->
    <div class="banner">
      <div class="container">
        <b-row>
          <b-col class="border-r">
            <div class="box">
              <p class="label">MTR Market Price</p>
              <p class="value">{{ mtrPrice }}</p>
            </div>
          </b-col>

          <b-col>
            <div class="box">
              <p class="label">MTRG Market Price</p>
              <p class="value">{{ mtrgPrice }}</p>
            </div>
          </b-col>

          <b-col>
            <div class="box">
              <p class="label">MTRG Price</p>
              <p class="value">{{ mtrgPriceInMtr }}</p>
            </div>
          </b-col>
        </b-row>
      </div>
    </div>

    <!-- active auctions -->
    <ActiveAuctions></ActiveAuctions>

    <!-- past auctions -->
    <PastAuctions />
  </div>
</template>

<script>
import ActiveAuctions from "@/components/ActiveAuctions.vue";
import PastAuctions from "@/components/PastAuctions.vue";

export default {
  name: "Home",

  components: {
    ActiveAuctions,
    PastAuctions,
  },

  data() {
    return {
      msg: "Welcome to Index!!!",
      mtrPrice: "0 USD",
      mtrgPrice: "0 USD",
      mtrgPriceInMtr: "0.5 MTR",
    };
  },

  methods: {
    async init() {
      const res = await this.$api.metric.getAll(this.network);
      const { mtr, mtrg } = res;
      this.mtrPrice = "$ " + mtr.price;
      this.mtrgPrice = "$ " + mtrg.price;
      this.mtrgPriceInMtr =
        Math.floor((100 * mtr.price) / mtrg.price) / 100 + " MTR";
    },
  },
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
