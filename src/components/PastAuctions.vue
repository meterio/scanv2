<template>
  <b-container class="table-container">
    <h3 class="title">Past Auctions ({{systemToken}})</h3>
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
import DataTableV2 from "@/components/DataTableV2.vue";
import { bigNumMinus } from "@/utils";
import { DEPLOY_DOMAIN, SYSTEM_COIN, SYSTEM_TOKEN } from "@/config";

export default {
  name: "PastAuctions",
  data() {
    return {
      systemToken: SYSTEM_TOKEN,
      auctions: {
        pagination: {
          show: true,
          align: "center",
          perPage: 8,
        },
        fields: [
          { key: "auction_start_height", label: "Start KBlock" },
          { key: "auction_end_height", label: "End KBlock" },
          { key: "mtrg_on_auction", label: SYSTEM_TOKEN + " on Auction" },
          { key: "mtr_received", label: "Received " + SYSTEM_COIN },
          { key: "sold_mtrg", label: "Sold " + SYSTEM_TOKEN },
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
          auction_start_height: { type: "block", block: a.auctionStartHeight },
          auction_end_height: { type: "block", block: a.auctionEndHeight },
          mtr_received: {
            type: "amount",
            amount: a.received,
            precision: 4,
            token: SYSTEM_COIN,
          },
          mtrg_on_auction: {
            type: "amount",
            amount: a.released,
            precision: 4,
            token: SYSTEM_TOKEN,
          },
          sold_mtrg: {
            type: "amount",
            amount: bigNumMinus(a.released, a.leftover),
            precision: 4,
            token: SYSTEM_TOKEN,
          },
          final_price: {
            type: "amount",
            amount: a.actualPrice,
            precision: 4,
            token: SYSTEM_COIN,
          },
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
