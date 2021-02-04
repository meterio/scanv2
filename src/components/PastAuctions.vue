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
          { key: "epoch_range", label: "Epoch Range" },
          { key: "end_height", label: "Settle KBlock" },
          { key: "mtr_received", label: "Received MTR" },
          { key: "sold_mtrg", label: "Sold MTRG" },
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
          prefix: "",
          epoch_range: `${a.startEpoch} - ${a.endEpoch}`,
          end_height: a.endHeight,
          mtr_received: fromWei(a.received, 6) + " MTR",
          sold_mtrg:
            fromWei(new BigNumber(a.released).minus(a.leftover), 6) + " MTRG",
          final_price: fromWei(a.actualPrice, 4),
          auctionid: a.id,
        };
      });
      return { items, totalRows };
    },
  },
};
</script>
