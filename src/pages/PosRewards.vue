<template lang="pug">
.detail
  b-container.summary
    h2.title Epoch Rewards

    b-card
      b-row.row(:key="item.key", v-for="item in summary")
        b-col(cols="2")
          span.label {{ item.key }}
        b-col(cols="10")
          span.value(v-if="!item.type") {{ item.value }}

    data-table.mt-2pert.px-0(
      title="Rewards Detail",
      :data="rewards"
    )
</template>

<script>
import StatusTag from "@/components/StatusTag.vue";
import { fromNow, formatTime } from "@/utils/time";
import { shortHash, shortAddress } from "@/utils/address";
import BigNumber from "bignumber.js";
import DataTable from "@/components/DataTable.vue";
export default {
  components: {
    DataTable,
    StatusTag
  },
  data() {
    return {
      summary: [],
      rewards: {
        fields: [
          { key: "address", label: "Address" },
          { key: "amount", label: "Amount" }
        ],
        items: [],
        pagination: {
          show: true,
          align: "center"
        }
      }
    };
  },
  async mounted() {
    const { epoch } = this.$route.params;
    const res = await this.$api.validator.getRewardsByEpoch(epoch);
    this.loading = false;
    this.summary = [
      { key: "Epoch", value: epoch },
      { key: "Base Reward", value: res.baseReward },
      { key: "Total Reward", value: res.totalReward }
    ];
    this.rewards.items.push(...res.rewards);
  },
  methods: {
    fromNow(time) {
      return fromNow(time * 1000);
    },
    shortAddr(addr) {
      return shortAddress(addr);
    },
    shortHash(hash) {
      return shortHash(hash);
    }
  }
};
</script>

<style lang="scss" scoped>
.detail {
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
