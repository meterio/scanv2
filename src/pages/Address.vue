<template lang="pug">
.account-detail
  b-container.summary
    h2.title Address {{ address }}
    b-card
      b-row.row(:key="item.key", v-for="item in summary")
        b-col(cols="2")
          span.label {{ item.key }}
        b-col(cols="10")
          span(v-if="item.block")
            router-link.link(
              :to="{ name: 'blockDetail', params: { revision: item.block } }"
            ) {{ item.block }}
            span.value {{ item.value }}

          span.value(v-else) {{ item.value }}
    b-card.mt-2pert.px-5
      pie-chart.px-0
    data-table.mt-2pert.px-0(
      title="Buckets",
      :data="buckets",
      :loading="bucket_load",
      :pagination="buckets.pagination"
    )
      template(v-slot:cell(candidate)="data")
        .dt-row
          router-link.link(
            :to="{ name: 'address', params: { address: data.item.candidate } }"
          ) {{ data.item.candidate }}

    data-table.mt-2pert.px-0(
      :data="txs",
      :loading="txs_load"
      :pagination="txs.pagination"
      :paginateTotal="address_total"
      :paginateCurrentPage="address_current_page"
      @tablePaginationChange="pgChange"
    )
      div(slot="header")
        nav-tabs.px-0(:tabs="address_tabs", @changeTab="navTabChange")

</template>

<script>
import StatusTag from "@/components/StatusTag.vue";
import { fromNow, formatTime } from "@/utils/time";
import { shortHash, shortAddress } from "@/utils/address";
import BigNumber from "bignumber.js";
import PieChart from "@/components/PieChart.vue";
import DataTable from "@/components/DataTable.vue";
import NavTabs from "@/components/NavTabs.vue";
export default {
  name: "Address",
  components: {
    PieChart,
    DataTable,
    NavTabs
  },
  data() {
    return {
      address_tabs: [
        { name: "Transations" },
        { name: "ERC20 Transactions", width: 170 }
      ],
      address_current_page: 1,
      address_total: 0,
      address: "0x",
      summary: {},
      account: {},
      bucket_load: true,
      txs_load: true,
      txs: {
        pagination: {
          show: true,
          align: "center",
          perPage: 8
        },
        fields: [
          { key: "txhash", label: "Hash" },
          { key: "blocknum", label: "Block" },
          { key: "timestamp", label: "Time" },
          { key: "from", label: "From" },
          { key: "to", label: "To" },
          { key: "amount", label: "Amount" }
        ],
        items: []
      },
      buckets: {
        pagination: {
          show: false,
          align: "center",
          perPage: 8
        },
        fields: [
          { key: "address", label: "Candidate Address" },
          { key: "totalVotes", label: "Votes" },
          { key: "timestamp", label: "Time" },
          { key: "bounded", label: "Bounded" }
        ],
        items: []
      },
      current_tab_index: 0
    };
  },
  beforeMount() {
    this.loadAddress();
    this.loadTxs();
  },
  methods: {
    navTabChange(val) {
      this.current_tab_index = val;
      this.address_current_page = 1;
      if (val == 0) {
        this.loadTxs();
      } else {
        this.loadTxs20();
      }
    },
    pgChange(val) {
      this.address_current_page = val;
      if (this.current_tab_index == 0) {
        this.loadTxs();
      } else {
        this.loadTxs20();
      }
    },
    async loadAddress() {
      try {
        const { address } = this.$route.params;
        this.loadBuckets(address);
        this.address = address;
        const res = await this.$api.account.getAccountDetail(address);

        const { account } = res;
        this.summary = [
          // { key: "Address", value: account.address },
          {
            key: "MTR Balance",
            value: account.mtrBalanceStr
          },
          {
            key: "MTRG Balance",
            value: account.mtrgBalanceStr
          },
          {
            key: "First Seen",
            value:
              account.firstSeen.number > 0
                ? "  (" + fromNow(account.firstSeen.timestamp * 1000) + ")"
                : "",
            block: account.firstSeen.number
          }
        ];
        this.account = account;
      } catch (e) {
        console.log(e);
      }
    },
    async loadBuckets(address) {
      this.bucket_load = true;
      try {
        const bres = await this.$api.account.getBuckets(address);
        const { buckets } = bres;
        for (const b of buckets) {
          this.buckets.items.push({
            address: b.candidate,
            totalVotes: b.totalVotes,
            timestamp: b.createTime,
            bounded: !b.unbounded
          });
        }
        this.bucket_load = false;
      } catch (e) {
        this.bucket_load = false;
      }
    },
    async loadTxs() {
      this.txs_load = true;
      try {
        const { address } = this.$route.params;
        this.txs.items = [];
        const { txSummaries, totalPage } = await this.$api.account.getTxs(
          address,
          this.address_current_page,
          this.page_size
        );
        this.address_total = totalPage * this.page_size;
        for (const t of txSummaries) {
          this.txs.items.push({
            txhash: t.hash,
            blocknum: t.block.number,
            from: t.origin,
            to: t.tos && t.tos.length > 0 ? t.tos[0].address : "nobody",
            amount: t.totalAmountStrs[0],
            timestamp: t.block.timestamp
          });
        }
        this.txs_load = false;
      } catch (e) {
        this.txs_load = false;
      }
    },
    async loadTxs20() {
      this.txs_load = true;
      this.txs.items = [];
      try {
        const { address } = this.$route.params;
        const { transfers, totalPage } = await this.$api.account.getTxs20(
          address,
          this.address_current_page,
          this.page_size
        );
        this.address_total = totalPage * this.page_size;
        for (const t of transfers) {
          this.txs.items.push({
            txhash: t.txHash,
            blocknum: t.block.number,
            from: t.from,
            to: t.to,
            amount: t.amount,
            timestamp: t.block.timestamp
          });
        }
        this.txs_load = false;
      } catch (e) {
        console.error(e);
        this.txs_load = false;
      }
    },
    timeFromNow(time) {
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
