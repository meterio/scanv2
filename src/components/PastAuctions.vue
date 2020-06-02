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
      <!-- column: height_post -->
      <template v-slot:cell(height_post)="data">
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
export default {
  name: "PastAuctions",
  data() {
    return {
      // Note `isActive` is left out and will not appear in the rendered table
      fields: [
        {
          key: "height_post",
          label: "Height(POS)"
        },
        {
          key: "settlement_k_block",
          label: "Settlement K Block"
        },
        {
          key: "mtr_received",
          label: "MTR Received"
        },
        {
          key: "mtrg_on_auction",
          label: "MTRG on Auction"
        },

        {
          key: "final_price",
          label: "Final Price"
        },
        {
          key: "more",
          label: "More"
        }
      ],
      items: [
        {
          height_post: "17894 - 34789",
          settlement_k_block: "1274",
          mtr_received: "2,89,789 MTR",
          mtrg_on_auction: "56,9080 MTRG",
          final_price: "3.45 USD",
          tx: "1"
        },
        {
          height_post: "17894 - 34789",
          settlement_k_block: "1274",
          mtr_received: "2,89,789 MTR",
          mtrg_on_auction: "56,9080 MTRG",
          final_price: "3.45 USD",
          tx: "2"
        }
      ]
    };
  },
  methods: {
    getBidsUrl: function(tx) {
      return `#${tx}`;
    }
  }
};
</script>
