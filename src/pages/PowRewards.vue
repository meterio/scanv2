<template lang="pug">
.detail
  data-summary(title="Mining Rewards", :data="summary")
  b-container.summary
    data-table.mt-2pert.px-0(title="Rewards Detail", :data="rewards")
</template>

<script>
import StatusTag from '@/components/StatusTag.vue';
import DataTable from '@/components/DataTable.vue';
import DataSummary from '@/components/DataSummary.vue';
export default {
  components: {
    DataTable,
    StatusTag,
    DataSummary,
  },
  data() {
    return {
      summary: [],
      rewards: {
        fields: [
          { key: 'fullAddress', label: 'Address' },
          { key: 'subTotalStr', label: 'Amount' },
        ],
        items: [],
        pagination: {
          show: true,
          align: 'center',
        },
      },
    };
  },
  methods: {
    async init() {
      this.loading = true;
      const { epoch } = this.$route.params;
      const res = await this.$api.pow.getRewardsByEpoch(this.network, epoch);
      this.loading = false;
      this.summary = [
        { key: 'Epoch', value: res.epoch },
        { key: 'Pos Block', value: res.posBlock },
        { key: 'Pow Block', value: res.powBlock },
        { key: 'Time', value: res.timestamp, type: 'timestamp' },
        { key: 'Total Amount', value: res.totalAmountStr },
      ];
      this.rewards.items.push(
        ...res.details.map((d) => {
          return { fullAddress: d.address, ...d };
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
