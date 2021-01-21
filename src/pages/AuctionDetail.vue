<template lang="pug">
.detail-page
  data-summary(:data="summary", :title="summaryTitle")
  data-table(title="Bids", :data="bids")
</template>

<script>
import StatusTag from "@/components/StatusTag.vue";
import BigNumber from "bignumber.js";
import DataTable from "@/components/DataTable.vue";
import DataSummary from "@/components/DataSummary.vue";
export default {
  components: {
    DataTable,
    DataSummary,
    StatusTag,
  },
  data() {
    return {
      summaryTitle: "Auction",
      summary: [],
      bids: {
        fields: [
          { key: "txid", label: "Tx ID" },
          { key: "address", label: "Address" },
          { key: "amount", label: "Amount" },
          { key: "timestamp", label: "Time" },
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
      const { auctionID } = this.$route.params;
      const res = await this.$api.auction.getBids(this.network, auctionID);
      this.loading = false;
      const { summary, bids } = res;
      this.summary = [
        { key: "ID", value: summary.id },
        {
          key: "Height Range",
          value: `${summary.startHeight} - ${summary.endHeight}`,
        },
        { key: "Received MTR", value: summary.receivedStr },
        { key: "Released MTRG", value: summary.releasedStr },
      ];
      this.bids.items.push(...res.bids);
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
