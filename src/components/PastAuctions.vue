<template>
  <b-container class="table-container">
    <h3 class="title">Past Auctions (MTRG)</h3>
    <b-table
      borderless
      hover
      class="data-table"
      :items="items"
      :fields="fields"
    >
      <!-- column: height_range -->
      <template v-slot:cell(height_range)="data">
        <div class="dt-row">
          <div class="icon icon-mint-past"></div>
          <span>{{ data.value }}</span>
        </div>
      </template>

      <template v-slot:cell(more)="data">
        <div class="dt-row">
          <a class="primary" :href="getBidsUrl(data.item.tx)">View Bids</a>
        </div>
      </template>

      <!-- default column format -->
      <template v-slot:cell()="data">
        <div class="dt-row">
          <span>{{ data.value }}</span>
        </div>
      </template>
    </b-table>
  </b-container>
</template>

<script>
import BigNumber from "bignumber.js";

export default {
  name: "PastAuctions",
  data() {
    return {
      // Note `isActive` is left out and will not appear in the rendered table
      fields: [
        {
          key: "height_range",
          label: "Height(POS)",
        },
        {
          key: "settlement_kblock",
          label: "Settlement K Block",
        },
        {
          key: "mtr_received",
          label: "MTR Received",
        },
        {
          key: "mtrg_on_auction",
          label: "MTRG on Auction",
        },

        {
          key: "final_price",
          label: "Final Price",
        },
        {
          key: "more",
          label: "More",
        },
      ],
      items: [
        {
          height_range: "17894 - 34789",
          settlement_kblock: "1274",
          mtr_received: "2,89,789 MTR",
          mtrg_on_auction: "56,9080 MTRG",
          final_price: "3.45 USD",
          tx: "1",
        },
        {
          height_range: "17894 - 34789",
          settlement_kblock: "1274",
          mtr_received: "2,89,789 MTR",
          mtrg_on_auction: "56,9080 MTRG",
          final_price: "3.45 USD",
          tx: "2",
        },
      ],
    };
  },
  methods: {
    getBidsUrl: function (tx) {
      return `#${tx}`;
    },
  },
  async mounted() {
    const res = await this.$api.auction.getPast();
    const { auctions } = res;
    this.items = [];
    for (const a of auctions) {
      this.items.push({
        height_range: `${a.startHeight} - ${a.endHeight}`,
        settlement_kblock: a.endHeight,
        mtr_received: a.receivedStr,
        mtrg_on_auction: a.releasedStr,
        final_price: new BigNumber(a.actualPrice).dividedBy(1e18).toFixed(),
        tx: "2",
      });
    }
  },
};
</script>
