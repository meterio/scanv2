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
      <!-- column: height_post -->
      <template v-slot:cell(height_post)="data">
        <div class="dt-row">
          <div class="block-icon"></div>
          <span>{{ data.value }}</span>
        </div>
      </template>

      <template v-slot:cell()="data">
        <i>{{ data.value }}</i>
      </template>
    </b-table>
  </b-container>
</template>

<script>
export default {
  name: "DataTable",
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
          key: "expected_final_price",
          label: "Expected Final Price"
        }
      ],
      items: [
        {
          height_post: "17894 - 34789",
          settlement_k_block: "1274",
          mtr_received: "2,89,789 MTR",
          mtrg_on_auction: "56,9080 MTRG",
          expected_final_price: "3.45 USD"
        },
        {
          height_post: "17894 - 34789",
          settlement_k_block: "1274",
          mtr_received: "2,89,789 MTR",
          mtrg_on_auction: "56,9080 MTRG",
          expected_final_price: "3.45 USD"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.table-container {
  margin-top: 30px;
  margin-bottom: 10px;

  .title {
    color: #5c6f8c;
    font-size: 16px;
  }
}

.block-icon {
  background-image: url("~@/assets/block.png");
  background-color: #ebeef6;
  background-repeat: no-repeat;
  background-position: center;
  width: 50px;
  height: 50px;
  border-radius: 5px;
}
</style>

<style lang="scss">
.data-table {
  background-color: #fff;
  border-radius: 5px;

  thead {
    color: #5c6f8c;
    font-size: 14px;
  }
}
</style>
