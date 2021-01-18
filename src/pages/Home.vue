<template lang="pug">
.home
  //- search-banner
  .search-banner
    .container
      h1.title Meter Blockchain Explorer
      search.mt25(
        :btnType="2",
        placeholder="Search Transation/Blocks/Address",
        @click="searchKeyWords"
      )
    <!-- card list -->
    //- block statistic
  data-dashboard.mt35(v-bind:rows="data", v-if="data.length > 0")
    //- node statistic
  b-container.px-0
    b-row
      b-col(cols="12", md="6")
        recent-blocks
      b-col(cols="12", md="6")
        recent-txs
  b-modal(v-model="modal_show", hide-footer, hide-header)
    .text-center Search No More Data
</template>

<script>
import Search from "@/components/Search.vue";
import DataDashboard from "@/components/DataDashboard.vue";
import RecentBlocks from "@/components/RecentBlocks.vue";
import RecentTxs from "@/components/RecentTxs.vue";
import {
  fromNow,
  formatTime,
  shortHash,
  shortAddress,
  fromWei,
  formatNum,
} from "@/utils";
import BigNumber from "bignumber.js";

export default {
  name: "Home",

  components: {
    Search,
    DataDashboard,
    RecentBlocks,
    RecentTxs,
  },

  data() {
    return {
      modal_show: false,
      // top nav tabs
      nav_tabs: ["PoS", "PoW"],
      // fake data
      msg: "Welcome to Index!!!",
      data: [],
    };
  },
  async mounted() {
    const res = await this.$api.metric.getAll();
    this.loading = false;
    const { mtr, mtrg, pos, pow, staking } = res;

    this.data = [
      [
        {
          label: "MTRG Price",
          content: "$ " + mtrg.price,
          change: mtrg.priceChange,
        },
        {
          label: "MTR Price",
          content: "$ " + mtr.price,
          change: mtr.priceChange,
        },
      ],
      [
        { label: "MTRG Circulation", content: formatNum(mtrg.circulation, 2) },
        { label: "MTR Circulation", content: formatNum(mtr.circulation, 2) },
      ],
      [
        { label: "Block Height", content: pos.best },
        { label: "Epoch", content: pos.epoch },
        { label: "Transactions", content: pos.txsCount },
        { label: "Avg Block Time", content: pos.avgBlockTime },
      ],
      [
        {
          label: "Online/Total Validators",
          content: `${staking.onlineNodes}/${staking.totalNodes}`,
        },
        {
          label: "Staked MTRG",
          content: fromWei(staking.totalStaked, 2) + " MTRG",
        },
        { label: "Inflation", content: pos.inflation },
        {
          label: "Average Daily Reward Pool",
          content: mtrg.avgDailyReward,
        },
      ],
    ];
    this.node_data = [
      [
        { label: "Validators", content: staking.validators },
        {
          label: "Total Staked",
          content: formatNum(staking.totalStaked, 6) + " MTRG",
        },
      ],
      [
        { label: "Height", content: pow.best },
        {
          label: "MTR Price",
          content: "$ " + mtr.price,
          change: mtr.priceChange,
        },
        {
          label: "Online/Total Node",
          content: `${staking.onlineNodes}/${staking.totalNodes}`,
        },
      ],
    ];
  },
  methods: {
    async searchKeyWords(key) {
      try {
        const { type } = await this.$api.search.searchKeyWord(key);
        console.log("res:>>", type);
        if (type === "tx") {
          this.$router.push("/tx/" + key);
        } else if (type == "block") {
          this.$router.push("/block/" + key);
        } else if (type == "address") {
          this.$router.push("/address/" + key);
        } else {
          this.modal_show = true;
        }
      } catch (e) {
        console.error(e);
        this.modal_show = true;
      }
    },
    timeFromNow(time) {
      return fromNow(time * 1000);
    },
    address(addr) {
      return shortAddress(addr);
    },
    shortHash(hash) {
      return shortHash(hash);
    },
    fromWei(num, precision) {
      return fromWei(num, precision);
    },
    formatNum(num, precision) {
      return formatNum(num, precision);
    },
  },
};
</script>

<style lang="scss" scoped>
.search-banner {
  background-image: url("~@/assets/banner_bg.png");
  height: 180px;
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
