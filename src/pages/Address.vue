<template lang="pug">
.account-detail
  b-container.summary
    h2.title Address Details
    b-card
      b-row
        b-col Address
        b-col.text-right(style="flex: 0 0 35%")
          span.label {{ account.mtrBalanceStr }}
      b-row
        b-col
          | {{ account.address }}
          b-icon.ml15(icon="file-earmark")
        b-col.text-right(style="flex: 0 0 35%")
          span.label {{ account.mtrgBalanceStr }}
    b-card.mt-2pert.px-5
      pie-chart.px-0
    data-table.mt-2pert.px-0(
      title="Buckets",
      :data="buckets",
      :pagination="buckets.pagination"
    )
      template(v-slot:cell(candidate)="data")
        .dt-row
          router-link.link(
            :to="{ name: 'address', params: { address: data.item.candidate } }"
          ) {{ data.item.candidate }}

    data-table.mt-2pert.px-0(
      title="Transactions",
      :data="txs",
      :pagination="txs.pagination"
    )
</template>

<script>
import StatusTag from "@/components/StatusTag.vue";
import { fromNow, formatTime } from "@/utils/time";
import { shortHash, shortAddress } from "@/utils/address";
import BigNumber from "bignumber.js";
import PieChart from "@/components/PieChart.vue";
import DataTable from "@/components/DataTable.vue";
export default {
  name: "Address",
  components: {
    PieChart,
    DataTable,
  },
  data() {
    return {
      summary: {},
      account: {},
      txs: {
        pagination: {
          show: true,
          align: "center",
        },
        fields: [
          { key: "txhash", label: "Hash" },
          { key: "blocknum", label: "Block" },
          { key: "timestamp", label: "Time" },
          { key: "from", label: "From" },
          { key: "to", label: "To" },
          { key: "amount", label: "Amount" },
        ],
        items: [],
      },
      buckets: {
        pagination: {
          show: true,
          align: "center",
        },
        fields: [
          { key: "address", label: "Candidate Address" },
          { key: "totalVotes", label: "Votes" },
          { key: "timestamp", label: "Time" },
          { key: "bounded", label: "Bounded" },
        ],
        items: [],
      },
    };
  },
  async mounted() {
    const { address } = this.$route.params;
    const res = await this.$api.account.getAccountDetail(address);
    this.loading = false;

    const { account } = res;
    this.summary = [
      { key: "Address", value: account.address },
      {
        key: "MTR Balance",
        value: account.mtrBalanceStr,
      },
      {
        key: "MTRG Balance",
        value: account.mtrgBalanceStr,
      },
      {
        key: "First Seen",
        value:
          account.firstSeen.number > 0
            ? "  (" + fromNow(account.firstSeen.timestamp * 1000) + ")"
            : "",
        block: account.firstSeen.number,
      },
      {
        key: "Last Updated",
        value:
          account.lastUpdate.number > 0
            ? "  (" + fromNow(account.lastUpdate.timestamp * 1000) + ")"
            : "",
        block: account.lastUpdate.number,
      },
    ];
    if (!!account.code) {
      this.summary.push({ key: "Code", value: account.code });
    } else {
      this.summary.push({ key: "Has Code", value: "no" });
    }
    if (!!account.master) {
      this.summary.push({ key: "Master", value: account.master });
    } else {
      this.summary.push({ key: "Has Master", value: "no" });
    }
    this.account = account;

    const bres = await this.$api.account.getBuckets(address);
    const { buckets } = bres;
    for (const b of buckets) {
      this.buckets.items.push({
        address: b.candidate,
        totalVotes: b.totalVotes,
        timestamp: b.createTime,
        bounded: !b.unbounded,
      });
    }

    const tres = await this.$api.account.getTxs(address);
    const { txSummaries } = tres;
    for (const t of txSummaries) {
      this.txs.items.push({
        txhash: t.hash,
        blocknum: t.block.number,
        from: t.origin,
        to: t.tos[0].address,
        amount: t.totalAmountStrs[0],
        timestamp: t.block.timestamp,
      });
    }
  },
  methods: {
    timeFromNow(time) {
      return fromNow(time * 1000);
    },
    address(addr) {
      return shortAddress(addr);
    },
    shortHash(hash) {
      return shortHash(hash);
    },
  },
};
</script>

<style lang="scss" scoped>
.block-detail {
  margin-top: 30px;
}

.summary {
  padding-top: 2%;
  .title {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .row {
    padding: 10px 0;
  }

  .label {
    color: #5c6f8c;
  }
  .mt-2pert {
    margin-top: 2.6%;
  }
}
</style>
