<template lang="pug">
.detail-page
  data-summary(:data="summary", :title="summaryTitle", :wide="true")
  data-table-v2(
    :loadItems="loadItems",
    :fields="fields",
    :pagination="pagination",
    :key="tabValue"
  )
    div(slot="header")
      nav-tabs.px-0(:tabs="tabs", :value="tabValue", @changeTab="navTabChange")
</template>

<script>
import StatusTag from "@/components/StatusTag.vue";
import DataTableV2 from "@/components/DataTableV2.vue";
import DataSummary from "@/components/DataSummary.vue";
import NavTabs from "@/components/NavTabs.vue";
import { bigNum, bigNumMinus } from "@/utils";
import BigNumber from "bignumber.js";

export default {
  components: {
    DataTableV2,
    DataSummary,
    StatusTag,
    NavTabs,
  },
  computed: {
    fields() {
      switch (this.tabValue) {
        case 0:
          return this.autobids.fields;
        case 1:
          return this.userbids.fields;
      }
      return this.autobids.fields;
    },
    pagination() {
      switch (this.tabValue) {
        case 0:
          return this.autobids.pagination;
        case 1:
          return this.userbids.pagination;
      }
      return this.autobids.pagination;
    },
    loadItems() {
      switch (this.tabValue) {
        case 0:
          return this.loadAutobidSummaries;
        case 1:
          return this.loadUserbids;
      }
      return this.loadAutobidSummaries;
    },
  },
  data() {
    return {
      summaryTitle: "Auction Detail",
      summary: [],
      tabs: [{ name: "Autobids" }, { name: "Userbids" }],
      tabValue: 0,
      autobids: {
        fields: [
          { key: "epoch", label: "Epoch" },
          { key: "blockNum", label: "Block" },
          { key: "amount", label: "Total Amount" },
          { key: "bidCount", label: "Bids" },
        ],
        items: [],
        pagination: {
          show: false,
          align: "center",
          perPage: 15,
        },
      },
      userbids: {
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
    navTabChange(val) {
      this.tabValue = val;
    },
    async loadUserbids(network, page, limit) {
      const { auctionID } = this.$route.params;
      const { userbids, totalRows } = await this.$api.auction.getUserbids(
        auctionID,
        network,
        page,
        limit
      );
      const items = userbids.map((b) => ({
        ...b,
        fullAddress: b.address,
        amount: {
          type: "amount",
          amount: b.amount,
          token: "STPT",
          precision: 6,
        },
        lotAmount: b.lotAmount
          ? {
              type: "amount",
              amount: b.lotAmount,
              token: "VERSE",
              precision: 6,
            }
          : "-",
      }));
      return { items, totalRows };
    },
    async loadAutobidSummaries(network, page, limit) {
      const { auctionID } = this.$route.params;
      const { autobidSummaries } = await this.$api.auction.getAutobidSummaries(
        auctionID,
        network
      );
      const items = autobidSummaries.map((b) => ({
        ...b,
        amount: { type: "amount", amount: b.total, token: "STPT", precision: 6 },
      }));
      return { items, totalRows: items.length };
    },

    async init() {
      const { auctionID } = this.$route.params;
      const res = await this.$api.auction.getAuction(this.network, auctionID);
      const { summary } = res;
      let actualPrice = summary.actualPrice;
      if (!summary.auctionEndHeight) {
        actualPrice = new BigNumber(summary.received)
          .dividedBy(summary.released)
          .times(1e18)
          .toFixed();
      }
      this.summary = [
        { key: "ID", value: summary.id },
        {
          key: "Height Range",
          start: summary.auctionStartHeight,
          end: summary.auctionEndHeight,
          type: "block-range",
        },
        {
          key: "Epoch Range",
          start: summary.auctionStartEpoch,
          end: summary.auctionEndEpoch,
          type: "epoch-range",
        },
        {
          key: "VERSE on Auction",
          type: "amount",
          value: bigNumMinus(summary.released, summary.leftover),
          token: "VERSE",
          precision: -1,
        },
        {
          key: "VERSE on Auction Generated Heights",
          value: `${summary.startHeight} - ${summary.endHeight}`,
        },
        {
          key: "Userbid Total",
          type: "amount",
          value: summary.userbidTotal,
          token: "STPT",
          precision: -1,
        },
        {
          key: "Autobid Total",
          type: "amount",
          value: summary.autobidTotal,
          token: "STPT",
          precision: -1,
        },
        {
          key: "Total Received",
          type: "amount",
          value: summary.received,
          token: "STPT",
          precision: -1,
        },
        { key: "Bids Count", value: summary.bidCount },
        {
          key: "Actual Price",
          type: "amount",
          value: actualPrice,
          token: "STPT",
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
