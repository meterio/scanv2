<template lang="pug">
.home
  //- search-banner
  .search-banner
    .container
      h1.title Meter Blockchain Explorer
      search.mt25(:btnType="2", placeholder="Search Transation/Blocks/Address")
    <!-- TODO:tab nav -->
  nav-tabs.mt10(:tabs="nav_tabs")
    <!-- card list -->
    //- block statistic
  data-dashboard(v-bind:rows="block_data")

    //- node statistic
  data-dashboard(v-bind:rows="node_data")
  b-container.px-0
    b-row
      b-col(cols="12", md="6")
        recent-blocks
      b-col(cols="12", md="6")
        recent-txs
</template>

<script>
import Search from "@/components/Search.vue";
import DataDashboard from "@/components/DataDashboard.vue";
import RecentBlocks from "@/components/RecentBlocks.vue";
import RecentTxs from "@/components/RecentTxs.vue";
import NavTabs from "@/components/NavTabs.vue";
import { fromNow, formatTime } from "@/utils/time";
import { shortHash, shortAddress } from "@/utils/address";
import BigNumber from "bignumber.js";

export default {
  name: "Home",

  components: {
    Search,
    DataDashboard,
    RecentBlocks,
    RecentTxs,
    NavTabs
  },

  data() {
    return {
      // top nav tabs
      nav_tabs: ["PoS", "PoW"],
      // fake data
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
  },
  async mounted() {
    const res = await this.$api.metric.getAll();
    this.loading = false;
    const { mtr, mtrg, pos, pow } = res;

    this.block_data = [
      [
        { label: "MTRG Price", content: mtrg.price, change: mtrg.priceChange },
        {
          label: "Average Daily Reward Pool",
          content: new BigNumber(mtrg.avgDailyReward).dividedBy(1e18).toFixed()
        }
      ],
      [
        { label: "Block Height", content: pos.best },
        { label: "K Block Height", content: pos.kblock },
        { label: "Stacked", content: "?10%" },
        { label: "Validators", content: pos.validators }
      ]
    ];
    this.node_data = [
      [
        { label: "Validators", content: pos.validators },
        {
          label: "Total Stacking",
          content: new BigNumber(mtrg.totalStaked).dividedBy(1e18).toFixed()
        }
      ],
      [
        { label: "Height", content: pow.best },
        { label: "Price", content: mtr.price, change: mtr.priceChange },
        {
          label: "Online/ Toal Node",
          content: `${pos.onlineNodes}/${pos.totalNodes}`
        }
      ]
    ];
  },
  methods: {
    timeFromNow(time) {
      return fromNow(time * 1000);
    },
    address(addr) {
      return shortAddress(addr);
    },
    shortHash(hash) {
      return shortHash(hash);
    }
  }
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
