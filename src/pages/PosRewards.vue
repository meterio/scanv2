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
import { fromWei, fromNow, formatTime } from "@/utils";
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
      this.loading = false;
      this.summary = [
        { key: "Epoch", value: epoch },
        { key: "Height", value: res.height },
        { key: "Base Reward", value: fromWei(res.baseReward) + " MTR" },
        { key: "Total Reward", value: fromWei(res.totalReward) + " MTR" },
        { key: "Time", value: res.timestamp, type: "timestamp" },
      ];
      this.rewards.items.push(
        ...res.rewards.map((r) => {
          return { fullAddress: r.address, amount: fromWei(r.amount) + " MTR" };
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
