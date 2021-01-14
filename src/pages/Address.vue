<template>
  <div class="account-detail">
    <b-container class="summary">
      <h2 class="title">Account {{ account.address }}</h2>

      <b-card>
        <b-row class="row" :key="item.key" v-for="item in summary">
          <b-col cols="2">
            <span class="label">{{ item.key }}</span>
          </b-col>
          <b-col cols="10">
            <span class="value" v-if="item.block >= 0">
              <router-link
                :to="{ name: 'blockDetail', params: { revision: item.block } }"
                >#{{ item.block }}</router-link
              >
            </span>
            <span class="value">{{ item.value }}</span>
          </b-col>
        </b-row>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import StatusTag from "@/components/StatusTag.vue";
import { fromNow, formatTime } from "@/utils/time";
import { shortHash, shortAddress } from "@/utils/address";
import BigNumber from "bignumber.js";
export default {
  name: "Address",
  components: {},
  data() {
    return {
      summary: {},
      account: {},
    };
  },
  async mounted() {
    const { address } = this.$route.params;
    const res = await this.$api.account.getAccountDetail(address);
    this.loading = false;
    const { account } = res;
    this.summary = [
      { key: "Address", value: account.address },
      {
        key: "MTR Balance",
        value: `${new BigNumber(account.mtrBalance)
          .dividedBy(1e18)
          .toFixed()} MTR`,
      },
      {
        key: "MTRG Balance",
        value: `${new BigNumber(account.mtrgBalance)
          .dividedBy(1e18)
          .toFixed()} MTRG`,
      },
      {
        key: "First Seen",
        value:
          account.firstSeen.number > 0
            ? "  (" + fromNow(account.firstSeen.timestamp * 1000) + ")"
            : "",
        block: account.firstSeen.number,
      },
      {
        key: "Last Updated",
        value:
          account.lastUpdate.number > 0
            ? "  (" + fromNow(account.lastUpdate.timestamp * 1000) + ")"
            : "",
        block: account.lastUpdate.number,
      },
    ];
    if (!!account.code) {
      this.summary.push({ key: "Code", value: account.code });
    } else {
      this.summary.push({ key: "Has Code", value: "no" });
    }
    if (!!account.master) {
      this.summary.push({ key: "Master", value: account.master });
    } else {
      this.summary.push({ key: "Has Master", value: "no" });
    }
    this.account = account;
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
    },
  },
};
</script>


<style lang="scss" scoped>
.block-detail {
  margin-top: 30px;
}

.summary {
  .title {
    font-size: 20px;
    margin-bottom: 10px;
  }

  .row {
    padding: 10px 0;
  }

  .label {
    color: #5c6f8c;
  }
}
</style>
