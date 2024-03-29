<template>
  <b-container class="table-container">
    <h3 class="bold">Active Auctions (MTRG)</h3>
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
import DataTableV2 from '@/components/DataTableV2.vue';
import { formatNum, bigNumDiv, bigNumCompare } from '@/utils';
import BigNumber from 'bignumber.js';

export default {
  name: 'ActiveAuctions',
  data() {
    return {
      // Note `isActive` is left out and will not appear in the rendered table
      auction: {
        fields: [
          { key: 'end_height', label: 'Start KBlock' },
          { key: 'current_epoch', label: 'Current Epoch' },
          { key: 'auction_end_epoch', label: 'End Epoch' },
          { key: 'mtrg_on_auction', label: 'MTRG on Auction' },
          { key: 'mtr_received', label: 'Received MTR' },
          { key: 'expected_final_price', label: 'Expected Price' },
          { key: 'auctionDetail', label: 'Bids' },
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
        const res = await this.$api.block.getBest(this.network);
        const best = res.block;

        const { present } = await this.$api.auction.getPresent(this.network);
        this.load = false;
        const items = [];
        if (present.startHeight) {
          let actualPrice = new BigNumber(bigNumDiv(present.received, present.released)).times(1e18);
          const reservedPrice = present.reservedPrice;
          if (bigNumCompare(actualPrice, reservedPrice) < 0) {
            actualPrice = reservedPrice;
          }
          let leftoverEpoch = present.endEpoch + 24 - best.epoch || 0;
          items.push({
            prefix: '',
            epoch_range: `${present.startEpoch} - ${present.endEpoch}`,
            end_height: { type: 'block', block: present.endHeight },
            auction_end_epoch: `${present.endEpoch + 24} (in ${leftoverEpoch} hour${leftoverEpoch > 1 ? 's' : ''})`,
            current_epoch: best.epoch,
            mtr_received: {
              type: 'amount',
              amount: present.received,
              token: 'MTR',
              precision: 4,
            },
            mtrg_on_auction: {
              type: 'amount',
              amount: present.released,
              token: 'MTRG',
              precision: 4,
            },
            expected_final_price: {
              type: 'amount',
              amount: new BigNumber(actualPrice).toFixed(),
              token: 'MTR',
              precision: 4,
            },
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
tr[role='row'] {
  padding: 20px !important;
}
</style>
