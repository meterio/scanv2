<template>
  <b-container class="table-container">
    <h3 class="title">Active Auctions (MTRG)</h3>
    <DataTableV2 :fields="auction.fields" :items="auction.items" class="px-0">
      <!-- column: height_range -->
      <template v-slot:cell(prefix)="data">
        <div class="dt-row">
          <div class="icon icon-mint-active"></div>
          <span>{{ data.value }}</span>
        </div>
      </template>
    </DataTableV2>
  </b-container>
</template>

<script>
import DataTableV2 from "@/components/DataTableV2.vue";
import { fromWei, formatNum } from "@/utils";
import BigNumber from "bignumber.js";
export default {
  name: "ActiveAuctions",
  data() {
    return {
      // Note `isActive` is left out and will not appear in the rendered table
      auction: {
        fields: [
          { key: "prefix", label: "" },
          { key: "epoch_range", label: "Epoch Range" },
          { key: "end_height", label: "Settle KBlock" },
          { key: "mtrg_on_auction", label: "MTRG on Auction" },
          { key: "mtr_received", label: "Received MTR" },
          { key: "expected_final_price", label: "Expected Price" },
          { key: "auctionDetail", label: "Bids" },
        ],
        items: [],
      },
    };
  },
  components: {
    DataTableV2,
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
          let actualPrice = new BigNumber(present.received).dividedBy(
            present.released
          );

          const reservedPrice = new BigNumber(present.reservedPrice).dividedBy(
            1e18
          );
          if (actualPrice.isLessThan(reservedPrice)) {
            actualPrice = reservedPrice;
          }
          items.push({
            prefix: "",
            epoch_range: `${present.startEpoch} - ${present.endEpoch}`,
            end_height: present.endHeight,
            mtr_received: fromWei(present.received, 6) + " MTR",
            mtrg_on_auction: fromWei(present.released, 6) + " MTRG",
            expected_final_price: formatNum(actualPrice, 4),
            auctionDetail: {
              id: present.id,
              bidCount: present.bidCount,
            },
          });
        }
        this.auction.items = items;
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
