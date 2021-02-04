<template>
  <b-container class="table-container">
    <h3 class="title">Active Auctions (MTRG)</h3>
    <DataTable :data="auctionObj" class="px-0" :loading="load">
      <!-- column: height_range -->
      <template v-slot:cell(prefix)="data">
        <div class="dt-row">
          <div class="icon icon-mint-active"></div>
          <span>{{ data.value }}</span>
        </div>
      </template>
    </DataTable>
  </b-container>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import { fromWei } from "@/utils";
export default {
  name: "ActiveAuctions",
  data() {
    return {
      // Note `isActive` is left out and will not appear in the rendered table
      load: true,
      auctionObj: {
        fields: [
          { key: "prefix", label: "" },
          { key: "epoch_range", label: "Epoch Range" },
          { key: "end_height", label: "Settle KBlock" },
          { key: "mtr_received", label: "MTR Received" },
          { key: "mtrg_on_auction", label: "MTRG on Auction" },
          { key: "expected_final_price", label: "Expected Final Price" },
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
        const { present } = await this.$api.auction.getPresent(this.network);
        this.load = false;
        const items = [];
        if (present.startHeight) {
          items.push({
            prefix: "",
            epoch_range: `${present.startEpoch} - ${present.endEpoch}`,
            end_height: present.endHeight,
            mtr_received: fromWei(present.received, 6) + " MTR",
            mtrg_on_auction: fromWei(present.reserved, 6) + " MTRG",
            expected_final_price: fromWei(present.reservedPrice),
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

<style lang="scss" scoped>
tr[role="row"] {
  padding: 20px !important;
}
</style>
