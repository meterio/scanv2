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
      <template v-slot:cell(height_range)="data">
        <div class="dt-row">
          <div class="icon icon-mint-past"></div>
          <span>{{ data.value }}</span>
        </div>
      </template>
    </DataTableV2>
  </b-container>
</template>

<script>
import BigNumber from "bignumber.js";
import DataTableV2 from "@/components/DataTableV2.vue";

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
          { key: "height_range", label: "Height(POS)" },
          { key: "settlement_kblock", label: "Settlement K Block" },
          { key: "mtr_received", label: "MTR Received" },
          { key: "mtrg_on_auction", label: "MTRG on Auction" },
          { key: "final_price", label: "Final Price" },
          { key: "auctionid", label: "More" },
        ],
      },
    };
  },
  components: {
    DataTableV2,
  },
  methods: {
    async loadPast(network, page, limit) {
      const { totalPage, auctions } = await this.$api.auction.getPast(
        network,
        page,
        limit
      );
      const totalRows = totalPage * limit;

      const items = auctions.map((a) => {
        return {
          height_range: `${a.startHeight} - ${a.endHeight}`,
          settlement_kblock: a.endHeight,
          mtr_received: a.receivedStr,
          mtrg_on_auction: a.releasedStr,
          final_price: new BigNumber(a.actualPrice).dividedBy(1e18).toFixed(),
          auctionid: a.id,
        };
      });
      return { items, totalRows };
    },
  },
};
</script>
