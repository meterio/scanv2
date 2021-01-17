<template>
  <b-container class="table-container">
    <h3 class="title">Past Auctions (MTRG)</h3>
    <DataTable :data="pAuctions" class="px-0" :loading="load"></DataTable>
    <b-table
      borderless
      hover
      class="data-table"
      :items="items"
      :fields="fields"
    >
      <!-- column: height_range -->
      <template v-slot:cell(height_range)="data">
        <div class="dt-row">
          <div class="icon icon-mint-past"></div>
          <span>{{ data.value }}</span>
        </div>
      </template>

      <template v-slot:cell(more)="data">
        <div class="dt-row">
          <a class="primary" :href="getBidsUrl(data.value)">View Bids</a>
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
import BigNumber from "bignumber.js";
import DataTable from "@/components/DataTable.vue";

export default {
  name: "PastAuctions",
  data() {
    return {
      // Note `isActive` is left out and will not appear in the rendered table
      load: true,
      pAuctions: {
        fields: [
          {
            key: "height_range",
            label: "Height(POS)"
          },
          {
            key: "settlement_kblock",
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
        items: []
      }
    };
  },
  components: {
    DataTable
  },
  beforeMount() {
    this.loadPast();
  },
  methods: {
    getBidsUrl: function(tx) {
      return `/auction/${tx}`;
    },
    async loadPast() {
      try {
        const { auctions } = await this.$api.auction.getPast();
        const items = [];
        for (const a of auctions) {
          items.push({
            height_range: `${a.startHeight} - ${a.endHeight}`,
            settlement_kblock: a.endHeight,
            mtr_received: a.receivedStr,
            mtrg_on_auction: a.releasedStr,
            final_price: new BigNumber(a.actualPrice).dividedBy(1e18).toFixed(),
            more: a.id
          });
        }
        this.load = false;
        this.pAuctions.items = items;
      } catch (e) {
        this.load = false;
      }
    }
  }
};
</script>
