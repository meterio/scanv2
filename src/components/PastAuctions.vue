<template>
  <b-container class="table-container">
    <h3 class="title">Past Auctions (MTRG)</h3>
    <DataTable
      :data="pAuctions"
      class="px-0"
      :loading="load"
      :pagination="pagination"
      :paginateTotal="paginateTotal"
      :paginateCurrentPage="page"
      @tablePaginationChange="pgChange"
    >
      <!-- column: height_range -->
      <template v-slot:cell(height_range)="data">
        <div class="dt-row">
          <div class="icon icon-mint-past"></div>
          <span>{{ data.value }}</span>
        </div>
      </template>
    </DataTable>
  </b-container>
</template>

<script>
import BigNumber from "bignumber.js";
import DataTable from "@/components/DataTable.vue";
import UiToastListVue from "./UiToastList.vue";

export default {
  name: "PastAuctions",
  data() {
    return {
      // Note `isActive` is left out and will not appear in the rendered table
      page: 1,
      limit: 8,
      paginateTotal: 10,
      load: true,
      pagination: {
        show: true,
        align: "center",
        perPage: 8,
      },
      pAuctions: {
        fields: [
          { key: "height_range", label: "Height(POS)" },
          { key: "settlement_kblock", label: "Settlement K Block" },
          { key: "mtr_received", label: "MTR Received" },
          { key: "mtrg_on_auction", label: "MTRG on Auction" },
          { key: "final_price", label: "Final Price" },
          { key: "auctionid", label: "More" },
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
      this.loadPast();
    },
    pgChange(val) {
      this.page = val;
      this.init();
    },
    getBidsUrl: function (tx) {
      return `/auction/${tx}`;
    },
    async loadPast() {
      try {
        const { totalPage, auctions } = await this.$api.auction.getPast(
          this.network,
          this.page,
          this.limit
        );
        this.paginateTotal = totalPage * this.limit;
        console.log(this.paginateTotal);

        let items = [];
        for (const a of auctions) {
          items.push({
            height_range: `${a.startHeight} - ${a.endHeight}`,
            settlement_kblock: a.endHeight,
            mtr_received: a.receivedStr,
            mtrg_on_auction: a.releasedStr,
            final_price: new BigNumber(a.actualPrice).dividedBy(1e18).toFixed(),
            auctionid: a.id,
          });
        }
        this.load = false;
        this.pAuctions.items = items;
      } catch (e) {
        this.load = false;
      }
    },
  },
};
</script>
