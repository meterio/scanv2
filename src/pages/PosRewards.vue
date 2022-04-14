<template lang="pug">
.detail
  data-summary(title="Epoch Rewards", :data="summary")
  b-container.summary
    data-table-v2.mt-2pert.px-0(
      title="Rewards Detail",
      :fields="rewards.fields",
      :items="rewards.items"
    )
</template>

<script>
import StatusTag from "@/components/StatusTag.vue";
import DataSummary from "@/components/DataSummary.vue";
import DataTableV2 from "@/components/DataTableV2.vue";
export default {
  components: {
    DataTableV2,
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
  computed: {
    tokenSymbol() {
      return this.currentChain.symbol;
    }
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
        {
          key: "Autobid Total",
          type: "amount",
          value: summary.autobidTotal,
          token: this.tokenSymbol,
          precision: -1,
        },
        { key: "Transfer Count", value: summary.transferCount },
        {
          key: "Transfer Total",
          type: "amount",
          value: summary.transferTotal,
          token: this.tokenSymbol,
          precision: -1,
        },
        { key: "Reward Count", value: rewards ? rewards.length : 0 },
        {
          key: "Total Reward",
          type: "amount",
          value: summary.totalReward,
          token: this.tokenSymbol,
          precision: -1,
        },
        { key: "Time", value: summary.timestamp, type: "timestamp" },
      ];
      this.rewards.items.push(
        ...rewards.map((r) => {
          return {
            fullAddress: r.addr,
            amount: {
              type: "amount",
              amount: r.amount,
              token: this.tokenSymbol,
              precision: -1,
            },
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
