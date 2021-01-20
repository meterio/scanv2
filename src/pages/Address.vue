<template lang="pug">
.detail-page
  data-summary(:title="'Address: ' + address", :data="summary")

  b-container.summary
    #b-card.mt-2pert.px-5
      #pie-chart.px-0
    data-table.mt-2pert.px-0(
      title="Buckets",
      :data="buckets",
      :loading="bucket_load",
      :pagination="buckets.pagination"
    )
      template(v-slot:cell(candidate)="data")
        .dt-row
          router-link.link(
            :to="{ name: 'address', params: { network: $route.params.network, address: data.item.candidate } }"
          ) {{ data.item.candidate }}
      template(v-slot:cell(totalVotes)="data")
        .dt-row {{ fromWei(data.item.totalVotes, 2) }} MTRG

    data-table.mt-2pert.px-0(
      :data="txs",
      :loading="txs_load",
      :pagination="txs.pagination",
      :paginateTotal="address_total",
      :paginateCurrentPage="address_current_page",
      @tablePaginationChange="pgChange"
    )
      div(slot="header")
        nav-tabs.px-0(:tabs="address_tabs", @changeTab="navTabChange")
</template>

<script>
import StatusTag from "@/components/StatusTag.vue";
import BigNumber from "bignumber.js";
import PieChart from "@/components/PieChart.vue";
import DataTable from "@/components/DataTable.vue";
import NavTabs from "@/components/NavTabs.vue";
import DataSummary from "@/components/DataSummary.vue";
export default {
  name: "Address",
  components: {
    PieChart,
    DataTable,
    NavTabs,
    DataSummary,
  },
  data() {
    return {
      address_tabs: [
        { name: "Transations" },
        { name: "ERC20 Transactions", width: 170 },
      ],
      address_current_page: 1,
      address_total: 0,
      address: "0x",
      summary: [],
      account: {},
      bucket_load: true,
      txs_load: true,
      txs: {
        pagination: {
          show: true,
          align: "center",
          perPage: 8,
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
          show: false,
          align: "center",
          perPage: 8,
        },
        fields: [
          { key: "address", label: "Candidate Address" },
          { key: "totalVotes", label: "Votes" },
          { key: "timestamp", label: "Time" },
          { key: "status", label: "Status" },
        ],
        items: [],
      },
      current_tab_index: 0,
    };
  },
  beforeMount() {},
  methods: {
    init() {
      this.loadAddress();
      this.loadTxs();
    },
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
        const res = await this.$api.account.getAccountDetail(
          this.$route.params.network,
          address
        );

        const { account } = res;
        this.summary = [
          // { key: "Address", value: account.address },
          {
            key: "MTR Balance",
            value: account.mtrBalanceStr,
          },
          {
            key: "MTRG Balance",
            value: account.mtrgBalanceStr,
          },
        ];
        if (account.firstSeen && account.firstSeen.number > 0) {
          this.summary.push({
            key: "First Seen",
            type: "block-link-with-note",
            value: fromNow(account.firstSeen.timestamp * 1000),
            block: account.firstSeen.number,
          });
        }
        this.account = account;
      } catch (e) {
        console.log(e);
      }
    },
    async loadBuckets(address) {
      this.bucket_load = true;
      try {
        const bres = await this.$api.account.getBuckets(
          this.$route.params.network,
          address
        );
        const { buckets } = bres;
        for (const b of buckets) {
          this.buckets.items.push({
            address: b.candidate,
            totalVotes: b.totalVotes,
            timestamp: b.createTime,
            status: b.unbounded ? "Unbounded" : "Created",
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
          this.$route.params.network,
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
            timestamp: t.block.timestamp,
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
          this.$route.params.network,
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
            timestamp: t.block.timestamp,
          });
        }
        this.txs_load = false;
      } catch (e) {
        console.error(e);
        this.txs_load = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.summary {
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
