<template lang="pug">
.detail
  b-container.summary
    h2.title Auction Detail

    b-card
      b-row.row(:key="item.key", v-for="item in summary")
        b-col(cols="2")
          span.label {{ item.key }}
        b-col(cols="10")
          span.value(v-if="!item.type") {{ item.value }}

    data-table.mt-2pert.px-0(
      title="Bids Detail",
      :data="bids",
    )
</template>

<script>
import StatusTag from "@/components/StatusTag.vue";
import { fromNow, formatTime } from "@/utils/time";
import { shortHash, shortAddress } from "@/utils/address";
import BigNumber from "bignumber.js";
import DataTable from "@/components/DataTable.vue";
export default {
  components: {
    DataTable,
    StatusTag
  },
  data() {
    return {
      summary: [],
      bids: {
        fields: [
          { key: "txid", label: "Tx ID" },
          { key: "address", label: "Address" },
          { key: "amount", label: "Amount" },
          { key: "timestamp", label: "Time" }
        ],
        items: [],
        pagination: {
          show: true,
          align: "center"
        }
      }
    };
  },
  async mounted() {
    const { auctionID } = this.$route.params;
    const res = await this.$api.auction.getBids(auctionID);
    this.loading = false;
    const { summary, bids } = res;
    this.summary = [
      { key: "ID", value: summary.id },
      {
        key: "Start/End Height",
        value: `${summary.startHeight} - ${summary.endHeight}`
      },
      { key: "Received MTR", value: summary.receivedStr },
      { key: "Released MTRG", value: summary.releasedStr }
    ];
    this.bids.items.push(...res.bids);
  },
  methods: {
    fromNow(time) {
      return fromNow(time * 1000);
    },
    shortAddr(addr) {
      return shortAddress(addr);
    },
    shortHash(hash) {
      return shortHash(hash);
    }
  }
};
</script>

<style lang="scss" scoped>
.detail {
  margin-top: 30px;
}

.summary {
  .title {
    font-size: 20px;
    margin-bottom: 10px;
  }

  .row {
    padding: 10px 0;
  }

  .label {
    color: #5c6f8c;
  }
}
</style>
