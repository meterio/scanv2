<template>
  <div class="auction">
    <!-- banner -->
    <div class="banner">
      <div class="container">
        <b-row>
          <b-col class="border-r">
            <div class="box">
              <p class="label">{{ systemCoin }} Market Price</p>
              <p class="value">{{ mtrPrice }}</p>
            </div>
          </b-col>

          <b-col>
            <div class="box">
              <p class="label">{{ systemToken }} Market Price</p>
              <p class="value">{{ mtrgPrice }}</p>
            </div>
          </b-col>

          <b-col>
            <div class="box">
              <p class="label">{{ systemToken }} Price</p>
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
import {SYSTEM_COIN, SYSTEM_TOKEN} from "../config";

export default {
  name: "Home",

  components: {
    ActiveAuctions,
    PastAuctions,
  },

  data() {
    return {
      systemCoin: SYSTEM_COIN,
      systemToken: SYSTEM_TOKEN,
      msg: "Welcome to Index!!!",
      mtrPrice: "$ -.--",
      mtrgPrice: "$ -.--",
      mtrgPriceInMtr: "- " + SYSTEM_COIN,
    };
  },

  methods: {
    async init() {
      const res = await this.$api.metric.getAll(this.network);
      const { mtr, mtrg } = res;
      this.mtrPrice = "$ " + mtr.price;
      this.mtrgPrice = "$ " + mtrg.price;
      this.mtrgPriceInMtr =
        Math.floor((100 * mtrg.price) / mtr.price) / 100 + " " + SYSTEM_COIN;
    },
  },
};
</script>

<style lang="scss" scoped>
.banner {
  // background-image: url("~@/assets/banner_bg.png");
  background: #6171ff;
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
