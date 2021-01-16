<template lang="pug">
.detail
  b-container.summary
    h2.title Mining Rewards

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
          { key: "subTotalStr", label: "Amount" }
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
    console.log("epoch:>>", epoch);
    const res = await this.$api.pow.getRewardsByEpoch(epoch);
    this.loading = false;
    this.summary = [
      { key: "Epoch", value: res.epoch },
      { key: "Pos Block", value: res.posBlock },
      { key: "Pow Block", value: res.powBlock },
      { key: "Time", value: fromNow(res.timestamp * 1000) },
      { key: "Total Amount", value: res.totalAmountStr }
    ];
    this.rewards.items.push(...res.details);
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
