<template>
  <b-container class="table-container">
    <h3 class="title">Active Auctions (MTRG)</h3>
    <DataTable :data="auctionObj" class="px-0" :loading="load">
      <!-- column: height_range -->
      <template v-slot:cell(height_range)="data">
        <div class="dt-row">
          <div class="icon icon-mint-active"></div>
          <span>{{ data.value }}</span>
        </div>
      </template>
    </DataTable>
    <!-- <b-table
      borderless
      hover
      class="data-table"
      :items="items"
      :fields="fields"
    > -->

    <!-- default column format -->
    <!-- <template v-slot:cell()="data">
        <div class="dt-row">
          <span>{{ data.value }}</span>
        </div>
      </template>
    </b-table> -->
  </b-container>
</template>

<script>
import BigNumber from "bignumber.js";
import DataTable from "@/components/DataTable.vue";
export default {
  name: "ActiveAuctions",
  data() {
    return {
      // Note `isActive` is left out and will not appear in the rendered table
      load: true,
      auctionObj: {
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
        items: [],
      },
    };
  },
  components: {
    DataTable,
  },
  methods: {
    init() {
      this.loadAuctions();
    },
    async loadAuctions() {
      try {
        const { present } = await this.$api.auction.getPresent(
          this.$route.params.network
        );
        this.load = false;
        const items = [];
        if (present.startHeight) {
          items.push({
            height_range: `${present.startHeight} - ${present.endHeight}`,
            settlement_k_block: present.endHeight,
            mtr_received: present.receivedStr,
            mtrg_on_auction: present.reservedStr,
            expected_final_price: new BigNumber(present.reservedPrice)
              .dividedBy(1e18)
              .toFixed(),
          });
        }
        this.auctionObj.items = items;
      } catch (e) {
        this.load = false;
        console.error(e);
      }
    },
  },
};
</script>
