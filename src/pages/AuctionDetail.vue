<template lang="pug">
.detail-page
  data-summary(:data="summary", :title="summaryTitle", :wide="true")
  data-table-v2(
    title="Bids",
    :loadItems="loadBids",
    :fields="bids.fields",
    :pagination="bids.pagination"
  )
</template>

<script>
import StatusTag from "@/components/StatusTag.vue";
import DataTableV2 from "@/components/DataTableV2.vue";
import DataSummary from "@/components/DataSummary.vue";
import BigNumber from "bignumber.js";

export default {
  components: {
    DataTableV2,
    DataSummary,
    StatusTag,
  },
  data() {
    return {
      summaryTitle: "Auction Detail",
      summary: [],
      bids: {
        fields: [
          { key: "fullAddress", label: "Address" },
          { key: "type", label: "Type" },
          { key: "blockNum", label: "Block" },
          { key: "amount", label: "Amount" },
          { key: "lotAmount", label: "Lot Amount" },
        ],
        items: [],
        pagination: {
          show: true,
          align: "center",
          perPage: 15,
        },
      },
    };
  },
  methods: {
    async loadBids(network, page, limit) {
      const { auctionID } = this.$route.params;
      const { bids, totalRows } = await this.$api.auction.getBids(
        auctionID,
        network,
        page,
        limit
      );
      const items = bids.map((b) => ({
        ...b,
        fullAddress: b.address,
        txid: b.id,
        amount: {
          type: "amount",
          amount: new BigNumber(b.amount).toFixed(),
          token: "MTR",
          precision: 6,
        },
        lotAmount: b.lotAmount
          ? {
              type: "amount",
              amount: new BigNumber(b.lotAmount).toFixed(),
              token: "MTRG",
              precision: 6,
            }
          : "-",
      }));
      return { items, totalRows };
    },
    async init() {
      const { auctionID } = this.$route.params;
      const res = await this.$api.auction.getAuction(this.network, auctionID);
      const { summary } = res;
      console.log(summary);
      this.summary = [
        { key: "ID", value: summary.id },
        {
          key: "Auction Start Height",
          value: summary.auctionStartHeight,
          type: "block-link",
        },
        { key: "Auction End Height", value: summary.auctionEndHeight },
        {
          key: "MTRG on Auction",
          type: "amount",
          value: new BigNumber(summary.released)
            .minus(summary.leftover)
            .toFixed(),
          token: "MTRG",
          precision: -1,
        },
        {
          key: "MTRG on Auction Generated Heights",
          value: `${summary.startHeight} - ${summary.endHeight}`,
        },
        {
          key: "Userbid Total",
          type: "amount",
          value: summary.userbidTotal,
          token: "MTR",
          precision: -1,
        },
        {
          key: "Autobid Total",
          type: "amount",
          value: summary.autobidTotal,
          token: "MTR",
          precision: -1,
        },
        {
          key: "Total Received",
          type: "amount",
          value: summary.received,
          token: "MTR",
          precision: -1,
        },
        { key: "Bids Count", value: summary.bidCount },
        {
          key: "Actual Price",
          type: "amount",
          value: summary.actualPrice,
          token: "MTR",
          precision: 4,
        },
      ];
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
