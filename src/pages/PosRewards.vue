<template lang="pug">
.detail
  data-summary(title="Epoch Rewards", :data="summary")
  b-container.summary
    data-table.mt-2pert.px-0(title="Rewards Detail", :data="rewards")
</template>

<script>
import StatusTag from "@/components/StatusTag.vue";
import DataSummary from "@/components/DataSummary.vue";
import DataTable from "@/components/DataTable.vue";
import { fromWei } from "@/utils";
export default {
  components: {
    DataTable,
    DataSummary,
    StatusTag,
  },
  data() {
    return {
      summary: [],
      rewards: {
        fields: [
          { key: "fullAddress", label: "Address" },
          { key: "amount", label: "Amount" },
          { key: "type", label: "Type" },
        ],
        items: [],
        pagination: {
          show: true,
          align: "center",
        },
      },
    };
  },
  methods: {
    async init() {
      const { epoch } = this.$route.params;
      const res = await this.$api.validator.getRewardsByEpoch(
        this.network,
        epoch
      );
      const { summary, rewards } = res;
      this.loading = false;
      this.summary = [
        { key: "Epoch", value: epoch },
        { key: "Height", value: summary.blockNum, type: "block-link" },
        { key: "Autobid Count", value: summary.autobidCount },
        { key: "Autobid Total", value: fromWei(summary.autobidTotal) + " MTR" },
        { key: "Transfer Count", value: summary.transferCount },
        {
          key: "Transfer Total",
          value: fromWei(summary.transferTotal) + " MTR",
        },
        { key: "Reward Count", value: rewards ? rewards.length : 0 },
        { key: "Total Reward", value: fromWei(summary.totalReward) + " MTR" },
        { key: "Time", value: summary.timestamp, type: "timestamp" },
      ];
      this.rewards.items.push(
        ...rewards.map((r) => {
          return {
            fullAddress: r.addr,
            amount: fromWei(r.amount) + " MTR",
            type: r.type,
          };
        })
      );
    },
  },
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
