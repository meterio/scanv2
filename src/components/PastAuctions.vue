<template>
  <b-container class="table-container">
    <h3 class="title">Past Auctions (MTRG)</h3>
    <DataTableV2
      :fields="auctions.fields"
      class="px-0"
      :pagination="auctions.pagination"
      :loadItems="loadPast"
    >
      <!-- column: height_range -->
      <template v-slot:cell(prefix)="data">
        <div class="dt-row">
          <div class="icon icon-mint-past" style="display: inline-block"></div>
          <span>{{ data.value }}</span>
        </div>
      </template>
    </DataTableV2>
  </b-container>
</template>

<script>
import BigNumber from "bignumber.js";
import DataTableV2 from "@/components/DataTableV2.vue";
import { fromWei } from "@/utils";

export default {
  name: "PastAuctions",
  data() {
    return {
      auctions: {
        pagination: {
          show: true,
          align: "center",
          perPage: 8,
        },
        fields: [
          { key: "prefix", label: "" },
          { key: "auction_start_height", label: "Start KBlock" },
          { key: "auction_end_height", label: "End KBlock" },
          { key: "mtrg_on_auction", label: "MTRG on Auction" },
          { key: "mtr_received", label: "Received MTR" },
          { key: "sold_mtrg", label: "Sold MTRG" },
          { key: "final_price", label: "Final Price" },
          { key: "auctionDetail", label: "Bids" },
        ],
      },
    };
  },
  components: {
    DataTableV2,
  },
  methods: {
    async loadPast(network, page, limit) {
      const { auctions, totalRows } = await this.$api.auction.getPast(
        network,
        page,
        limit
      );

      const items = auctions.map((a) => {
        return {
          prefix: "",
          epoch_range: `${a.startEpoch} - ${a.endEpoch}`,
          auction_start_height: a.auctionStartHeight,
          auction_end_height: a.auctionEndHeight,
          mtr_received: fromWei(a.received, 6) + " MTR",
          mtrg_on_auction: fromWei(a.released, 4) + " MTRG",
          sold_mtrg:
            fromWei(new BigNumber(a.released).minus(a.leftover), 6) + " MTRG",
          final_price: fromWei(a.actualPrice, 4),
          auctionDetail: {
            id: a.id,
            bidCount: a.bidCount,
          },
        };
      });
      return { items, totalRows };
    },
  },
};
</script>
