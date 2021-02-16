<template lang="pug">
.detail-page
  data-summary(:data="summary", :title="summaryTitle")
  data-table(title="Bids", :data="bids")
</template>

<script>
import StatusTag from "@/components/StatusTag.vue";
import DataTable from "@/components/DataTable.vue";
import DataSummary from "@/components/DataSummary.vue";
import { fromWei } from "@/utils";
import BigNumber from "bignumber.js";

export default {
  components: {
    DataTable,
    DataSummary,
    StatusTag,
  },
  data() {
    return {
      summaryTitle: "Auction Detail",
      summary: [],
      bids: {
        fields: [
          { key: "txid", label: "Auction Tx ID" },
          { key: "address", label: "Address" },
          { key: "type", label: "Type" },
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
      const { summary } = res;
      console.log(summary);
      this.summary = [
        { key: "ID", value: summary.id },
        {
          key: "Epoch Range",
          value: `${summary.startEpoch} - ${summary.endEpoch}`,
        },
        {
          key: "Height Range",
          value: `${summary.startHeight} - ${summary.endHeight}`,
        },
        { key: "MTR Received", value: summary.receivedStr },
        {
          key: "MTRG on Auction",
          value:
            fromWei(new BigNumber(summary.released).minus(summary.leftover)) +
            " MTRG",
        },
        { key: "Bids Count", value: summary.bidCount },
        { key: "Actual Price", value: fromWei(summary.actualPrice) },
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
