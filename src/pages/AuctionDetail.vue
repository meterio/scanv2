<template lang="pug">
.detail-page
  data-summary(:data="summary", :title="summaryTitle")
  data-table(title="Bids", :data="bids")
</template>

<script>
import StatusTag from "@/components/StatusTag.vue";
import DataTable from "@/components/DataTable.vue";
import DataSummary from "@/components/DataSummary.vue";
import { fromWei, formatNum, shortHash } from "@/utils";
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
          { key: "fullAddress", label: "Address" },
          { key: "type", label: "Type" },
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
      const { auctionID } = this.$route.params;
      const res = await this.$api.auction.getBids(this.network, auctionID);
      this.loading = false;
      const { summary } = res;
      let actualPrice = new BigNumber(summary.received).dividedBy(
        summary.released
      );
      let reservedPrice = new BigNumber(summary.reservedPrice).dividedBy(1e18);
      if (actualPrice.isLessThan(reservedPrice)) {
        actualPrice = reservedPrice;
      }
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
        { key: "Actual Price", value: formatNum(actualPrice, 4) },
      ];
      this.bids.items.push(
        ...res.bids.map((b) => ({
          ...b,
          txid: shortHash(b.txid, 12),
          amount: fromWei(b.amount) + " MTR",
          fullAddress: b.address,
        }))
      );
      console.log(res.bids);
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
