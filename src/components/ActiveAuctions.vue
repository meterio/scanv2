<template>
  <b-container class="table-container">
    <h3 class="title">Active Auctions (MTRG)</h3>
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
          <div class="icon icon-mint-active"></div>
          <span>{{ data.value }}</span>
        </div>
      </template>

      <template v-slot:cell(expected_final_price)="data">
        <div class="dt-row">
          <span class="primary">{{ data.value }}</span>
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
  name: "ActiveAuctions",
  data() {
    return {
      // Note `isActive` is left out and will not appear in the rendered table
      fields: [
        {
          key: "height_range",
          label: "Height(POS)",
        },
        {
          key: "settlement_k_block",
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
          key: "expected_final_price",
          label: "Expected Final Price",
        },
      ],
      items: [
        {
          height_range: "17894 - 34789",
          settlement_k_block: "1274",
          mtr_received: "2,89,789 MTR",
          mtrg_on_auction: "56,9080 MTRG",
          expected_final_price: "3.45 USD",
        },
        {
          height_range: "17894 - 34789",
          settlement_k_block: "1274",
          mtr_received: "2,89,789 MTR",
          mtrg_on_auction: "56,9080 MTRG",
          expected_final_price: "3.45 USD",
        },
      ],
    };
  },
  async mounted() {
    const res = await this.$api.auction.getPresent();
    const { present } = res;
    this.items = [];
    this.items.push({
      height_range: `${present.startHeight} - ${present.endHeight}`,
      settlement_k_block: present.endHeight,
      mtr_received: present.receivedStr,
      mtrg_on_auction: present.reservedStr,
      expected_final_price: new BigNumber(present.reservedPrice)
        .dividedBy(1e18)
        .toFixed(),
    });
  },
};
</script>
